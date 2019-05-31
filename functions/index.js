const functions = require('firebase-functions')
require("firebase/firestore")
var admin = require('firebase-admin')
var algoliasearch = require('algoliasearch')
const sgMail = require('@sendgrid/mail');
var stripe = require("stripe")(functions.config().stripe.secretkey)
var _ = require('lodash')

var env = functions.config()
sgMail.setApiKey(env.sendgrid.apikey)
const config = {
  apiKey: env.firb.apikey,
  authDomain: env.firb.auth,
  databaseURL: env.firb.dburl,
  "projectId": env.firb.projectid,
  storageBucket: env.firb.storagebucket,
  messageSenderId: env.firb.messagesenderid,
}

//Search "change" to find things to update before productions

admin.initializeApp(config)

const client = algoliasearch(env.algolia.appid, env.algolia.apikey)
const index = client.initIndex('mentors')
const userIndex = client.initIndex('users')

exports.onNewUser = functions.firestore
.document('users/{userId}').onCreate((snap, context) => {
  let userData = snap.data()
  let { email, name } = userData
  let userId = context.params.userId  

  indexUser(userData, userId)
  createCustomer(userData, userId)
  sendWelcomeEmail(email, name, userId)
})

exports.onNewMentor = functions.firestore
.document('users/{userId}').onCreate((snap, context) => {
  let { email, name } = snap.data()
  let userId = context.params.userId  

  createConnectAccount(email)
  indexMentor(data, userId)
  sendCoachWelcomeEmail(email, name, userId)
})

exports.stripeEvent = functions.https.onRequest((request, response) => {
  const body = request.body;
  const eventType = body.type;

  switch (eventType) {
    case 'customer.created':
      stripeCustomerCreated(body, request, response);
      break;
    case 'customer.subscription.created':
      stripeChargeSuccess(body, request, response);
      break;
    case 'account.external_account.created':
      stripeConnectCreated(body, request, response)
      break;
    case 'customer.source.created':
      stripeCustomerSourceCreated(body, request, response)
      break;
    case 'customer.source.updated':
      stripeCustomerSourceUpdated(body, request, response)
      break;
    case 'charge.succeeded':
      customerCharged(body, request, response)
    default:
      response.send('Stripe Event type mismatch')
  }
})

exports.twilioEvent = functions.https
.onRequest((request, response) => {

  response.send('Recieved');
})

exports.cardTokenReceived = functions.firestore
.document('users/{userId}/card_tokens/{tokenId}')
.onCreate((snap, context) => {
  let card = snap.data()
  let userId = context.params.userId

  //Get stripe id
  stripe.tokens.create(card).then((token) => {
    return admin.firestore().collection('users')
    .doc(userId).get().then((user) => {
      //connect card to customer
      return stripe.customers.createSource(
        user.data().stripeId,
        {
          source: token.tokenId,
        }
      )
    })
  }).then((token) => {
    //Attach new payment method
    return stripe.customers.update(
      token.customer,
       {
        default_source: token.id
       }
    )
  }).then((res) => {
    return admin.firestore().collection('users')
    .doc(userId).update({ card: token.card })
  }).catch((err) => {
    console.log(err)
  })
})

exports.connectExternalBank = functions.firestore
.document('coaches/{mentorId}/bank_tokens/{tokenId}')
.onCreate((snap, context) => {
  //  Get connect ID 
  //  make back account token

  let info = snap.data()
  let mentorId = context.params.mentorId

  //get connect acount id
  
  return stripe.tokens.create({
    bankAccount: {
      info
    }
  }).then((token) => {
    return admin.firestore().collection('coaches')
    .doc(mentorId).get().then((user) => {
      return {
        connectAccountId: user.data().connectAccountId, 
        token
      }
    })
  }).then(({connectAccountId, token}) => {
    //create external account using connectId and bank token
    return stripe.accounts.createExternalAccount(
      connectAccountId,
      {
        external_account: token.id,
      }
    )
  }).catch((err) => {
    console.log(err)
  })
})

exports.mentorCardToken = functions.firestore
.document('coaches/{mentorId}/card_tokens/{tokenId}')
.onCreate((snap, context) => {
  const token = snap.data
  const mentorId = context.params.mentorId

  admin.firestore().collection('coaches')
  .doc(mentorId).get().then((user) => user.data().connectAccountId)
  .then((connectAccountId) => {
    return stripe.customers.createSource(
      connectAccountId,
       {
          source: token.tokenId
       }
    )
  }).catch((err) => {
    return err
  })
})

exports.chargeReceived = functions.firestore
.document('users/{userId}/charges/{chargeId}')
.onCreate((snap, context) => {
  const info = snap.data()
  const ref = context.ref
  const chargeId = context.params.chargeId

  return stripe.charges.create(info, {
    idempotency_key: chargeId
  }).then((res) => {
    return ref.update({
      charge: res
    })
  }).then(() => {
    console.log('Customer charged')
  }).catch((err) => {
    return err;
  })
})

exports.transferMentorFunds = functions.firestore
.document('coaches/{coachId}/transfers/{transferId}')
.onCreate((snap, context) => {
  const info = snap.data()
  const ref = context.ref
  const transferId = context.params.transferId

  stripe.transfers.create(info, {
    idempotency_key: transferId
  }).then((res) => {
    ref.update({
      transfer: res
    })
  }).catch((err) => {
    return err
  })
})

exports.payoutMentor = functions.firestore
.document('coaches/{mentorId}/payouts/{payoutId}')
.onCreate((snap, context) => {
  const { amount, currency, docIds } = snap.data()
  const ref = context.ref
  const payoutId = context.params.payoutId
  const mentorId = context.params.mentorId

  admin.firestore().collection('coaches')
  .doc(mentorId).get().then((user) => user.connectAccountId)
  .then((connectAccountId) => {
    return stripe.payout.create({
      amount,
      currency,
      destination: connectAccountId
    }, {
      idempotency_key: payoutId
    })
  }).then((res) => {
    return ref.update({
      payout: res
    })
  }).then(() => {
    return _.forEach(docIds, (docId) => {
      admin.firestore().collection('coaches').doc(mentorId)
      .collection('practices').doc(docId)
      .update({
        paid: true,
      }).catch((err) => err)
    })
  }).catch((err) => {
    return err
  })
})

exports.updateMentor = functions.firestore
  .document('coaches/{coachId}')
  .onUpdate((change, context) => {
    const data = change.after.data()
    const objectID = change.after.id
    return index.partialUpdateObject({
      objectID,
      ...data,
      data: {},
  })
})

//Updates the mentor profile info in the user's db
exports.mentorProfileUpdated = functions.firestore
.document('coaches/{coachId}')
.onUpdate((change, context) => {
  let data = change.after.data()
  data.joined = ''
  console.log(data)
  let coachId = context.params.coachId

  return admin.firestore().collection('coaches').doc(coachId)
  .collection('users').get().then((querySnap) => {
    if (querySnap.empty) {
      return;
    }

    querySnap.forEach((doc) => {
      let uid = doc.data().user.userId
      admin.firestore().collection('users')
      .doc(uid).collection('mentors').doc(coachId)
      .update(data).then(() => {
        console.log('updated mentor profile')
      })
    })
  })
})

exports.deleteMentor = functions.firestore
  .document('coaches/{coachId}')
  .onDelete((snap, context) => {
    const objectID = snap.id

    return index.deleteObject(objectID)
})

exports.updateUser = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const data = change.after.data()
    const objectID = change.after.id
    return userIndex.partialUpdateObject({
      objectID,
      ...data,
      data: {},
  })
})

// When user profile is updated the information changes on the mentor side
exports.userProfileUpdated = functions.firestore
.document('users/{userId}')
.onUpdate((change, context) => {
  let data = change.after.data()
  data.joined = ''
  let userId = context.params.userId

  return admin.firestore().collection('users').doc(userId)
  .collection('mentors').get().then((querySnap) => {
    if (querySnap.empty) {
      return;
    }

    querySnap.forEach((doc) => {
      let uid = doc.data().mentor.id
      admin.firestore().collection('coaches')
      .doc(uid).collection('users').doc(userId)
      .update(data).then(() => {
        console.log('updated user profile')
      })
    })
  })
})

exports.deleteUser = functions.firestore
  .document('users/{userId}')
  .onDelete((snap, context) => {
    const objectID = snap.id
    
    return userIndex.deleteObject(objectID)
})

exports.userMsgNotification = functions.firestore
.document("users/{userId}/mentors/{mentorId}/messages/{messageId}")
.onCreate((snap, context) => {
  let userId = context.params.userId
  const user = snap.data().user
  if (user == userId) {
    let text = snap.data().text
    let title = 'Message From ' + snap.data().name
    let body = text.substring(0, 70) + '...'

    return admin.firestore().collection('users')
    .doc(userId).get().then((doc) => {
      let token = doc.data().apn_token
      let message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      }
      sendMessage(message)
    })
  }
})

exports.mentorMsgNotification = functions.firestore
.document("coaches/{coachId}/users/{userId}/messages/{messageId}")
.onCreate((snap, context) => {
  let userId = context.params.coachId
  const user = snap.data().user
  if (user == userId) {
    let text = snap.data().text
    let title = 'Message From ' + snap.data().name
    let body = text.substring(0, 70) + '...'

    return admin.firestore().collection('coaches')
    .doc(userId).get().then((doc) => {
      let token = doc.data().apn_token
      let message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      }
      sendMessage(message)
    })
  }
})

exports.mentorBookingNotification = functions.firestore
.document("coaches/{coachId}/lessons/{lessonId}")
.onUpdate((snap, context) => {
  // let lessonId = context.params.lessonId
  const user = snap.data().user
  if (user == userId) {
    text = snap.data().text
    let title = 'Confirm Session Booked ' + snap.data().name
    let body = text.substring(0, 70) + '...'

    return admin.firestore().collection('users')
    .doc(userId).get().then((doc) => {
      let token = doc.data().apn_token
      let message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      }
      sendMessage(message)
    })
  }
})

exports.userBookingReminderNotification = functions.firestore
.document("users/{userId}/lessons/{lessonId}")
.onCreate((snap, context) => {
  let userId = context.params.lessonId
  const user = snap.data().user
  if (user == userId) {
    let text = snap.data().text
    let title = 'Message From ' + snap.data().name
    let body = text.substring(0, 70) + '...'

    return admin.firestore().collection('users')
    .doc(userId).get().then((doc) => {
      let token = doc.data().apn_token
      let message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      }
      sendMessage(message)
    })
  }
})

exports.onUserCreated = functions.firestore
.document("users/{userId}").onCreate((snap, context) => {
  let { email, name } = snap.data()
  let subject = "Welcome to Demia"
  let body = `Hi, ${name}, we're so happy to have you aboard. My name is Jonathan and I'm one of the founder of Demia. I'd be happy to respond to any questions you have or even any suggestions you have for the app. Thanks so much for giving it a go!`
  let _email = Email({
    email, 
    name, 
    subject, 
    templateId :null, 
    body, 
  })

  return sgMail.send(_email)
}) 

/*

    (change)
    To be exported to helper functions files 
    along with stripe functions

*/

const indexUser = (data, objectID) => {
    return userIndex.addObject({
      objectID,
      ...data,
      data: {},
  })
}

const indexMentor = (data, objectID) => {
    return index.addObject({
      objectID,
      ...data,
      data: {}
  })
}


//to fire a push notification to user
const sendMessage = (message) => {
  return admin.messages().send(message).then((resp) => {
    console.log(resp)
  })
}

//email object for sgMail.send()
// 8be7490d-cbc0-4ea8-9a43-12f17b35351a
const Email = ({ email, name, subject, templateId, body }) => {
  return {
    to: email,
    from: '007j.edgar@gmail.com', //change to business email
    subject: subject,
    text: body,
    templateId: templateId,
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      name: name,
      email: email,
    }
  }
}

const createCustomer = (user, userId) => {
    const { email, name } = user
  
    // chargebee
    var fullName = name.split(' ')
    let firstName = fullName[0]
    let lastName = fullName[1]
  
    // stripe
    var userDetails = {
      "description": `Account for ${name}`,
      "email": email,
    };
  
    stripe.customer.create(userDetails).then((solved) => {
      let stripeId = solved.id
      return firebase.firestore().collection('users')
      .doc(userId).update({ stripeId })
    }).catch((err) => {
      console.log(err)
    })
  }
  
  const createConnectAccount = (email) => {
    return stripe.accounts.create({
      "email": email,
      "country": "US",
      "type": "custom",
    }).then((solved) => {
      let connectAccountId = solved.id
      admin.firestore().collection('coaches')
      .doc(userId).update({ connectAccountId })
    })
  }

const sendWelcomeEmail = (email, name, userId) => {
    let subject = "Welcome to VarsityPrep"
    let body = `Hi, ${name}, we're so happy to have you aboard. My name is Jonathan and I'm one of the technical founders of VarsityPrep. I'd be happy to respond to any questions you have or even any suggestions you have for the app. Thanks so much for giving it a go!`
    let doc = Email({
      email, 
      name, 
      subject, 
      templateId: null, 
      body, 
      userId,
    })
  
    return sgMail.send(doc)
  }

  const sendCoachWelcomeEmail = (email, name, userId) => {
    let subject = "Welcome to VarsityPrep"
    let body = `Hi, ${name}, we're so happy to have you aboard. My name is Jonathan and I'm one of the technical founders of VarsityPrep. I'd be happy to respond to any questions you have or even any suggestions you have for the app. Thanks so much for giving it a go!`
    let doc = Email({
      email, 
      name, 
      subject, 
      templateId: null, 
      body, 
      userId,
    })
  
    return sgMail.send(doc)
  }


const stripeCustomerCreated = (body, request, response) => {
    const data = body.data.object;
    const customerId = data.id;
    console.log('customer: ', customerId);
  
    admin.firestore().collection('customers').doc(customerId)
    .set({
      customer: data,
    }).then(() => {
      console.log('updated doc');
      response.send('Customer Created');
    }).catch((err) => {
      console.log('error', err);
      response.status(500).send('Customer Not Created');
    })
  }
  
  const stripeCustomerSourceCreated = (body, request, response) => {
    const data = body.data.object;
    const customerId = data.id;
  
    admin.firestore().collection('customers').doc(customerId)
    .update({
      source: data,
    }).then(() => {
      response.send('Customer source created');
    }).catch((err) => {
      console.log('error', err);
      response.status(500).send('Customer Not Created');
    })
  }
  
  const stripeCustomerSourceUpdated = (body, request, response) => {
    const data = body.data.object;
    const customerId = data.id;
  
    admin.firestore().collection('customers').doc(customerId)
    .update({
      source: data,
    }).then(() => {
      response.send('Customer source updated');
    }).catch((err) => {
      console.log('error', err);
      response.status(500).send('Customer Not Created');
    })
  }
  
  const stripeChargeSuccess = (body, request, response) => {
    const data = body.data.object;
    const customerId = data.customer;
    console.log('data: ', data);
  
    admin.firestore().collection('customers').doc(customerId)
    .collection(body.type).add({
      data,
    }).then(() => {
      console.log('updated doc')
      response.send('Customer Subscribed');
    }).catch((err) => {
      console.log('error', err)
      response.send('Customer Not Subscribed');
    })
  }
  
  const stripeConnectCreated = (body, request, response) => {
    const data = body.data.object;
    const customerId = data.id;
    admin.firestore().collection('connected_mentors').doc(customerId)
    .set({
      data,
    }).then(() => {
      response.status(200).send('Mentor connected');
    }).catch((err) => {
      console.log('error', err);
      response.status(500).send('Customer Not Created');
    })
  }
  
  const customerCharged = (body, request, response) => {
  
  }

  const markPaidLessons = (user, docIds, dispatch) => {
    _.forEach(docIds, (docId) => {
      try {
        firebase.firestore().collection('coaches').doc(user.uid)
          .collection('practices').doc(docId)
            .update({
              paid: true,
            }).then(() => {
              dispatch({ type: PAYOUT_SUCCESS })
            }).catch((err) => dispatch({ type: PAYOUT_FAILURE }))
      } catch(err) {
        dispatch({ type: PAYOUT_FAILURE })
      }
    })
  }