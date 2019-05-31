import firebase from 'react-native-firebase';
import {
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILED,
  FETCH_LESSON_HISTORY_SUCCESS,
  FETCH_LESSON_HISTORY_FAILURE,
  FETCH_DOC,
  FETCH_DOC_FAILED,
  CHANGE_METHOD_FAILED,
  CHANGE_METHOD_SUCCESS,
  FETCH_METHOD_FAILED,
  FETCH_METHOD_SUCCESS,
  FETCH_EXTERNAL_CARD_SUCCESS,
  FETCH_EXTERNAL_BANK_SUCCESS,
  DOC_SUBMITTED,
  DOC_SUBMITTED_FAILED,
  FETCH_AVAILABILITY,
  FETCH_AVAILABILITY_FAILED,
  FETCH_THREADS_FAILED,
  FETCH_THREADS_SUCCESS,
  ADD_CLASS,
  ADD_CLASS_FAIL,
  FETCH_CLASSES,
  FETCH_CLASSES_FAIL,
  REMOVE_CLASS,
  REMOVE_CLASS_FAIL,
} from './types'
import base64 from '../util/base64';
import {
  STRIPE_SECRET,
}  from '../config'
var _ = require('lodash')
 
//used in coachProfile -> componentDidMount
export const fetchReviews = (coachId) => {
  return (dispatch) => {
    if (coachId) {
      try {
        const reviews = []
        firebase.firestore().collection('coaches').doc(coachId)
          .collection('reviews').get().then((querySnapshot) => {
            if (querySnapshot.empty) {
              dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: reviews })
            }
            querySnapshot.forEach((doc) => {
              var review = doc.data()
              reviews.push(review)
              dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: reviews })
            })
          })
      } catch(err) {
        dispatch({ type: FETCH_REVIEWS_FAILED })
      }
    }
  }
}

export const saveDoc = (documentInfo) => {
  console.log(documentInfo)
  const { docType, docURL } = documentInfo
  return (dispatch) => {
    try {
      firebase.firestore().collection('coaches').doc(user.uid)
        .collection('documents').doc(docType).set({
          docURL: docURL,
          docType: docType,
          hasBeenReviewed: false,
        }).then(() => {
          flagSubmitted(docType, dispatch)
        }).catch((err) => {
          console.log('saveDoc error ', err)
        })
    } catch(err) {
      dispatch({ type: DOC_SUBMITTED_FAILED })
    }
  }
}

const flagSubmitted = (submittedType, dispatch) => {
  let update = {}
  switch (submittedType) {
    case 'parentDoc':
      update = {parentDoc: true }
      break;
    case 'counselorDoc':
      update = {counselorDoc: true }
      break;
    case 'photoId':
      update = {idPic: true }
      break;
    case 'tosAccepted':
      update = {tosAccepted: true }
      break;
    default:
      return;
  }
  try {
    firebase.firestore().collection('coaches').doc(user.uid)
      .update(update).then(() => {
        dispatch({ type: DOC_SUBMITTED })
      }).catch((err) => console.log('flagSubmitted', err))
  } catch(err) {
    dispatch({ type: DOC_SUBMITTED_FAILED })
    console.log('flagSubmitted', err)
  }
}

export const submitPersonalInfo = (personal, address) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
        .get().then((doc) => {
          const connectId = doc.data().connectAccountId
          personalInfo(connectId, personal, address)
        })
    } catch(err) {
      console.log('personalInfo err', err)
    }
  }
}

const personalInfo = (connectId, personal, address) => {
  const stripeURL = `https://api.stripe.com/v1/accounts/${connectId}`
  const { city, line1, line2, zip, state } = address
  const { firstName, lastName, birth, ssn } = personal
  _birth = birth.split('/')
  var day = _birth[1]
  var month = _birth[0]
  var year = _birth[2]

  const info = {
    "legal_entity[address[city]]": `${city}`,
    "legal_entity[address[line1]]": `${line1}`,
    "legal_entity[address[line2]]": `${line2}`,
    "legal_entity[address[postal_code]]": `${zip}`,
    "legal_entity[address[state]]": state,
    "legal_entity[dob[day]]": `${day}`,
    "legal_entity[dob[month]]": `${month}`,
    "legal_entity[dob[year]]": `${year}`,
    "legal_entity[first_name]": `${firstName}`,
    "legal_entity[last_name]": `${lastName}`,
    "legal_entity[ssn_last_4]": `${ssn}`,
    "legal_entity[type]": "individual",
  }

  formBody = encoder(info);
  fetch(stripeURL, {
    method: 'post',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
    }),
    body: formBody,
  }).then((res) => console.log(res.json()))
  .catch((err) => {
    console.log(err)
  })
}

export const fetchLessonHistory = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    var practices = []
    firebase.firestore().collection('coaches').doc(user.uid)
    .collection('practices').where("completedBy", "<", new Date)
    .where("paid", "==", false).onSnapshot((querySnap) => {
      if (querySnap.empty) {
        const info = {
          empty: true,
          practices: [],
        }
        dispatch({ type: FETCH_LESSON_HISTORY_SUCCESS, payload: info })
      }

      querySnap.forEach((doc) => {
        const { date, id, lesson, user, userId, paid, completedBy } = doc.data()
        const practice = {
          date, lesson, user, userId, paid, id, completedBy,
          docId: doc.id,
        }
        // console.log(practice)
        practices.push(practice)
        const info = {
          empty: false,
          practices: practices,
        }
        dispatch({ type: FETCH_LESSON_HISTORY_SUCCESS, payload: info })
      })
    }).catch((err) => {
      dispatch({ type: FETCH_LESSON_HISTORY_FAILURE, payload: err })
    })
  }
}

const encoder = (info) => {
  var formBody = [];
  for (var property in info) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(info[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return formBody;
}

export const fetchDocs = (docId) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    try {
      firebase.firestore().collection('coaches').doc(docId)
        .collection('documents').get().then((querySnap) => {
          if (querySnap.empty) {
            return dispatch({ type: FETCH_DOC })
          }
          var docs = []

          querySnap.forEach((doc) => {
            docs.push(doc.data())
            dispatch({ type: FETCH_DOC, payload: docs })
          })
        }).catch((err) => dispatch({ type: FETCH_DOC_FAILED }))
    } catch(err) {
      dispatch({ type: FETCH_DOC_FAILED })
    }
  }
}

export const changeDefaultMethod = (method) => {
  return (dispatch) => {
    if (method != 'bank_routing' && method != 'debit_card') {
      return dispatch({ type: CHANGE_METHOD_FAILED })
    }
    const user = firebase.auth().currentUser
    try {
      firebase.firestore().collection('coaches').doc(user.uid)
        .update({
          defaultMethod: method,
        }).then(() => {
          dispatch({ type: CHANGE_METHOD_SUCCESS })
        }).catch((err) => console.log('err', err))
    } catch(err) {
      dispatch({ type: CHANGE_METHOD_FAILED })
    }
  }
}

export const fetchMethod = () => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
        .onSnapshot((doc) => {
          const { defaultMethod } = doc.data()
          dispatch({ type: FETCH_METHOD_SUCCESS, payload: defaultMethod })
        })
    } catch(err) {
      dispatch({ type: FETCH_METHOD_FAILED })
    }
  }
}

export const fetchExternalCard = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('coaches').doc(user.uid)
      .get().then((doc) => {
        const stripeAccount = doc.data().connectAccountId
        const cardId = doc.data().cardId
        const bankId = doc.data().bankId
        requestCard(stripeAccount, cardId, dispatch)
        requestBank(stripeAccount, bankId, dispatch)
      })
  }
}

const requestCard = (stripeAccount, cardId, dispatch) => {
  const stripeURL = `https://api.stripe.com/v1/accounts/${stripeAccount}/external_accounts/${cardId}`
  try {
    fetch(stripeURL, {
      method: 'post',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
      })
    }).then((resp) => resp.json())
    .then((solved) => {
      if (solved.error) {
        return dispatch({ type: FETCH_EXTERNAL_CARD_SUCCESS, payload: {} })
      }
      console.log('solved', solved)
      const card = {
        brand: solved.brand,
        last4: solved.last4,
        payout_methods: solved.available_payout_methods,
      }
      dispatch({ type: FETCH_EXTERNAL_CARD_SUCCESS, payload: card })
    })
  } catch(err) {
    console.log('err', err)
  }
}

const requestBank = (stripeAccount, bankId, dispatch) => {
  const stripeURL = `https://api.stripe.com/v1/accounts/${stripeAccount}/external_accounts/${bankId}`
  fetch(stripeURL, {
    method: 'post',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
    })
  }).then((resp) => resp.json())
  .then((solved) => {
    if (solved.error) return dispatch({ type: FETCH_EXTERNAL_BANK_SUCCESS, payload: {} })

    const bank = {
      bankName: solved.bank_name,
      last4: solved.last4,
    }
    dispatch({ type: FETCH_EXTERNAL_BANK_SUCCESS, payload: bank })
  })
}

export const fetchAvailability = () => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches')
      .doc(user.uid).get().then((doc) => {
        if (!doc) {
          return dispatch({ type: FETCH_AVAILABILITY, payload: [] })
        }
        var availability = doc.data().availibility
        dispatch({ type: FETCH_AVAILABILITY, payload: availability })
      }).catch((err) => console.log(err))
    } catch(err) {
      console.log(err)
      dispatch({ type: FETCH_AVAILABILITY_FAILED })
    }
  }
}

export const fetchThreads = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    try {
      firebase.firestore().collection('users')
      .doc(user.uid).collection('mentors')
      .onSnapshot((querySnap) => {
        if (querySnap.empty) {
          console.log('empty')
          let coaches = []
          return dispatch({ type: FETCH_THREADS_SUCCESS, payload: coaches })
        }

        let coaches = []
        querySnap.forEach((doc) => {
          let coach = doc.data()
          coach.id = doc.id
          coaches.push(coach)
          dispatch({ type: FETCH_THREADS_SUCCESS, payload: coaches })
        })
      })
    } catch(err) {
      dispatch({ type: FETCH_THREADS_FAILED })
    }
  }
}

export const addClass = (classInfo) => {
  return (dispatch) => {
      let user = firebase.auth().currentUser
      firebase.firestore().collection('coaches')
      .doc(user.uid).collection('classes')
      .add(classInfo).then(() => {
        dispatch({ type: ADD_CLASS })
      }).catch((err) => {
        console.log(err)
        dispatch({ type: ADD_CLASS_FAIL })
      })
  }
}

export const fetchClasses = () => {
  return (dispatch) => {
    try {
      let user = firebase.auth().currentUser
      firebase.firestore()
      .collection('coaches').doc(user.uid)
      .collection('classes').onSnapshot((querySnap) => {
        if (querySnap.empty) {
          return dispatch({ type: FETCH_CLASSES, payload: [] })
        }

        let classes = []
        querySnap.forEach((doc) => {
          let _class = doc.data()
          _class.id = doc.id
          classes.push(_class)
          dispatch({ type: FETCH_CLASSES, payload: classes })
        })
      })
    } catch(err) {
      dispatch({ type: FETCH_CLASSES_FAIL, payload: err })
    }
  }
}

export const fetchRelevantClasses = (coachId) => {
  return (dispatch) => {
    try {
      firebase.firestore()
      .collection('coaches').doc(coachId)
      .collection('classes').get().then((querySnap) => {
        if (querySnap.empty) {
          return dispatch({ type: FETCH_CLASSES, payload: [] })
        }

        let classes = []
        querySnap.forEach((doc) => {
          let _class = doc.data()
          _class.id = doc.id
          classes.push(_class)
          dispatch({ type: FETCH_CLASSES, payload: classes })
        })
      })
    } catch(err) {
      dispatch({ type: FETCH_CLASSES, payload: classes })
    }
  }
}

export const removeClass = (classId) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches')
    .doc(user.uid).collection('classes')
    .doc(classId).delete().then(() => {
      dispatch({ type: REMOVE_CLASS })
    }).catch(() => {
      dispatch({ type: REMOVE_CLASS_FAIL })
    })
  }
}

export const unSubClasses = () => {
  return (dispatch) => {
    firebase.firestore()
    .collection('coaches').doc(user.uid)
    .onSnapshot(() => {})
  }
}
