import {
  CARD_RETRIEVAL,
  RETRIEVAL_FAIL,
  RETRIEVAL_SUCCESS,
  ADD_METHOD_FAIL,
  ADD_METHOD_SUCCESS,
  CREDITS_SUCCESS,
  CREDITS_FAIL,
  PAYMENT_REQUEST,
  SUBSCRIPTION_FAILED,
  SUBSCRIPTION_SUCCESS,
  STRIPE_CUS_FAILED,
  STRIPE_CUS_SUCCESS,
  SUSPEND_SUBSCRIPTION,
  SUSPEND_SUBSCRIPTION_FAIL,
  FETCH_PAYMENT_HISTORY,
  FETCH_PAYMENT_H_FAILED,
  FETCH_PAYMENT_H_SUCCESS,
  STRIPE_TOK_FAILED,
  CREATE_SUBSCRIPTION,
  CREATE_SUBSCRIPTION_SUCCESS,
  CREATE_SUBSCRIPTION_FAILURE,
} from './types';
import {
  STRIPE_PUBLISHABLE,
  STRIPE_SECRET,
  CHARGEBEE_SITE_URL,
  CHARGEBEE_API_KEY,
 } from 'react-native-dotenv'
import firebase from 'react-native-firebase';
import base64 from '../util/base64';
import moment from 'moment';

const checkCustomer = () => {
  var user = firebase.auth().currentUser;
  firebase.firestore().collection("users").doc(user.uid)
    .get().then((doc) => {
      if (doc.data().customer) {
        var customer = doc.data().customer;
        return customer;
      } else {
        return null;
      }
    })
}

//called evrytime payment method is updated
const stripeToken = (cardInfo, stripeId, dispatch) => {
  const user = firebase.auth().currentUser;
  const tokenUrl = 'https://api.stripe.com/v1/tokens';
  var { name, number, exp_month, exp_year, cvc, address_zip, } = cardInfo;

  const info = {
    'card[name]': name,
    'card[number]': number,
    'card[exp_month]': exp_month,
    'card[exp_year]': exp_year,
    'card[cvc]': cvc,
    'card[address_zip]': address_zip,
  }
  const formBody = encoder(info)

    try {
      fetch(tokenUrl, {
        method: 'post',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
        }),
        body: formBody,
      }).then((resp) => {
        resp.json().then((solved) => {
          if (solved.error) {
            return dispatch({ type: STRIPE_TOK_FAILED });
          }
          const tokenId = solved.id;
          stripeCustomer(stripeId, tokenId, dispatch);
        })
      }).catch((err) => console.log('STRIPE_TOK_FAILED', err))
    } catch(err) {
      dispatch({ type: STRIPE_TOK_FAILED })
    }
}

//called after token is created
const stripeCustomer = (stripeId, tokenId, dispatch) => {
  var user = firebase.auth().currentUser;
  const stripeUrl = `https://api.stripe.com/v1/customers/${stripeId}`;
  userDetails = {
    'source': tokenId,
  }
  const formBody = encoder(userDetails)
  fetch( stripeUrl, {
    method: 'post',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
    }),
    body: formBody,
  }).then((resp) => {
      resp.json().then((solved) => {
        dispatch({ type: STRIPE_CUS_SUCCESS })
      }).catch((err) => {
        dispatch({ type: STRIPE_CUS_FAILED });
      })
  })
}

//Chargebee
const subscribeUser = (plan_id, credits, dispatch ) => {
  const user = firebase.auth().currentUser;
  var details = {
    "plan_id": plan_id,
    "meta_data": `{userUid: ${user.uid}, credits: ${credits}}`
  }

  const formBody = encoder(details)
  firebase.firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      const customerId = doc.data().customerId; //get customerId
      var _credits = doc.data().credits;
      const url = `https://${CHARGEBEE_SITE_URL}/api/v2/customers/${customerId}/subscriptions`
      try {
        fetch(url, {
          method: 'post',
          headers: new Headers ({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
          }),
          body: formBody,
        }).then((resp) => {
          resp.json().then((solved) => {
            if (solved.error_msg) {
              console.log('SUBSCRIPTION_FAILED', solved)
              var message = ['Subscription Failed', 'Check your network connection and payment method then try again.'];
              return dispatch({ type: SUBSCRIPTION_FAILED, payload: message });;
            }

            const customerId = solved.customer.id;
            const invoice = solved.invoice;
            const plan = solved.subscription;
            const updatedCredits = _credits + credits;

            firebase.firestore().collection("users")
            .doc(user.uid).update({
              customerId: customerId,
              plan: plan,
              credits: updatedCredits,
            }).then(() => {
              var message = ['Subscription Success', 'Check your subscriptions for more information on recurring charges.'];
              dispatch({ type: SUBSCRIPTION_SUCCESS, payload: message });
            }).catch((err) => {
              var message = ['Subscription Failed', 'Check your network connection then try again.'];
              dispatch({ type: SUBSCRIPTION_FAILED, payload: message });
            })

            firebase.firestore().collection('users').doc(user.uid)
              .collection('invoices').add({
                invoice,
              }).catch((err) => {
                var message = ['Subscription Failed', 'Check your network connection then try again. If your card has been charged, but credits do not appear contact support.'];
                dispatch({ type: SUBSCRIPTION_FAILED, payload: message });
              })
          })
        }).catch((err) => {
          var message = ['Subscription Failed', 'Check your network connection and payment method then try again.'];
          dispatch({ type: SUBSCRIPTION_FAILED, payload: message });
        }) //end of fetch
      } catch(err) {
        var message = ['Subscription Failed', 'Check your network connection and payment method then try again.'];
        dispatch({ type: SUBSCRIPTION_FAILED, payload: message });
      }
    }).catch((err) => console.log(' SUBSCRIPTION_FAILED err', err) )
}

//used in bookingSignup (Stripe)
export const purchaseCredits = ( credits, amount ) => {
  const user = firebase.auth().currentUser;
  const url = 'https://api.stripe.com/v1/charges';
  credits = Number(credits);
  amount = amount * 100 + ''
  amount.toString();
  var amounts = amount.split('.');

  return (dispatch) => {
    dispatch({ type: PAYMENT_REQUEST });
    try {
      firebase.firestore().collection('users').doc(user.uid)
        .get().then((doc) => {
          var customerId = doc.data().stripeId;
          var prevCredits = doc.data().credits;
          var details = {
            "customer": customerId,
            "amount": amounts[0],
            "currency": "usd",
            "description": "Charge for one time purchase of lesson credits",
          }

          const formBody = encoder(details)
          fetch(url, {
            method: 'post',
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
            }),
            body: formBody,
          }).then((response) => {
            response.json().then((solved) => {
              if (solved.error) {
                console.log('solved', solved)
                return dispatch({ type: CREDITS_FAIL });
              }
              console.log('solved', solved)
              const updatedCredits = prevCredits + credits;

              firebase.firestore().collection('users').doc(user.uid)
                .collection('payments').add({
                  payment: solved,
                }).catch((err) => {
                  console.log('credit error: ');
                })
              firebase.firestore().collection('users').doc(user.uid)
                .update({
                  credits: updatedCredits,
                }).then(() => {
                  const message = 'Credits Purchased';
                  dispatch({ type: CREDITS_SUCCESS, payload: message })
                }).catch((err) => console.log('credits error'))
            })
          }).catch((err) => console.log('credits error', err))
        })
    } catch(err) {
      console.log('err', err)
    }
  }
}

//Chargebee
export const addPaymentMethod = (cardInfo) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser;
      firebase.firestore().collection('users').doc(user.uid)
        .get().then((doc) => {
          const customerId = doc.data().customerId;
          const stripeId = doc.data().stripeId;
          getToken(cardInfo, customerId, stripeId, dispatch)
          stripeToken(cardInfo, stripeId, dispatch)

        }).catch((err) => dispatch({ type: ADD_METHOD_FAIL }))
    } catch(err) {
      dispatch({ type: ADD_METHOD_FAIL })
    }
  }
}

//called evrytime payment method is updated
const getToken = (cardInfo, customerId, stripeId, dispatch) => {
  // console.log('cardInfo', cardInfo)
  const tokenUrl = 'https://api.stripe.com/v1/tokens';
  var { name, number, exp_month, exp_year, cvc, address_zip, } = cardInfo;

  const info = {
    'card[name]': name,
    'card[number]': number,
    'card[exp_month]': exp_month,
    'card[exp_year]': exp_year,
    'card[cvc]': cvc,
    'card[address_zip]': address_zip,
    'card[gateway_account_id]': stripeId,
  }
  const formBody = encoder(info)

    try {
      fetch(tokenUrl, {
        method: 'post',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
        }),
        body: formBody,
      }).then((resp) => {
        resp.json().then((solved) => {
          if (solved.error) {
            return dispatch({ type: STRIPE_TOK_FAILED });
          }
          const token = solved.id
          updateCharebeeCard(token, customerId, stripeId, dispatch)
        })
      }).catch((err) => console.log('STRIPE_TOK_FAILED', err))
    } catch(err) {
      dispatch({ type: STRIPE_TOK_FAILED })
    }
}

const updateCharebeeCard = (token, customerId, stripeId, dispatch) => {
  const user = firebase.auth().currentUser
  const chargebeeUrl = `https://${CHARGEBEE_SITE_URL}/api/v2/customers/${customerId}/credit_card`
  const info = {
    'card[gateway_account_id]': stripeId,
    "tmp_token": token,
  }
  const formBody = encoder(info)
  try {
    fetch(chargebeeUrl, {
      method: 'post',
      headers: new Headers ({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
      }),
      body: formBody,
    }).then((resp) => {
      resp.json().then((solved) => {
        if (solved.message) {
          console.log('solved err', solved)
          let msgs = solved.message.split(': ')
          const message = msgs[1]
          return dispatch({ type: RETRIEVAL_FAIL, payload: message })
        }
        console.log('solved', solved)
        const last4 = solved.card.last4;
        const cardType = solved.card.card_type;
        const card = {
          last4: last4,
          cardType: cardType,
        }
        dispatch({ type: RETRIEVAL_SUCCESS, payload: card })
      })
    }).catch((err) => console.log('err', err))
  } catch(err) {
    console.log('updateCharebeeCard err', err)
  }
}

//Chargebee
export const retrieveCard = ( role ) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;

    firebase.firestore().collection(role).doc(user.uid)
      .get().then((doc) => {
        dispatch({ type: CARD_RETRIEVAL })

        if (!doc.exists) {
          dispatch({ type: RETRIEVAL_FAIL })
        }

        const customerId = doc.data().customerId;
        const url = `https://${CHARGEBEE_SITE_URL}/api/v2/cards/${customerId}`

        try {
          fetch(url, {
            method: 'GET',
            headers: new Headers ({
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
            }),
          }).then((response) => {
            response.json().then((solved) => {
              if (solved.message) {
                let msgs = solved.message.split(': ')
                const message = msgs[1]
                return dispatch({ type: RETRIEVAL_FAIL, payload: message })
              }
              const last4 = solved.card.last4;
              const cardType = solved.card.card_type;
              const card = {
                last4: last4,
                cardType: cardType,
              }
              dispatch({ type: RETRIEVAL_SUCCESS, payload: card });
            }).catch((err) => {
              dispatch({ type: RETRIEVAL_FAIL })
            })
          })
        } catch(err) {
          dispatch({ type: RETRIEVAL_FAIL })
        }
      }).catch((err) => dispatch({ type: RETRIEVAL_FAIL }))
  }
}

//Chargebee
export const suspendSubscription = (subscriptionId) => {
  const user = firebase.auth().currentUser;
  const url = `https://${CHARGEBEE_SITE_URL}/api/v2/subscriptions/${subscriptionId}/cancel`

  return (dispatch) => {
    try {
      fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
        }),
      }).then((response) => {
        response.json().then((solved) => {
          const plan = solved.subscription;
          if (solved.message) {
            message = [ "Suspension Unsuccessfull", "Please check your connection, or contact support if this problem contunues."];
            dispatch({ type: SUSPEND_SUBSCRIPTION, payload: message });
          }
          if (solved.subscription.status == 'cancelled') {
            message = [ "Subscription Suspended", "" ];
            dispatch({ type: SUSPEND_SUBSCRIPTION_FAIL, payload: message });
            firebase.firestore().collection('users').doc(user.uid)
              .update({
                plan: plan,
              }).catch((err) => {
                message = [ "Subscription Suspended", "" ];
                dispatch({ type: SUSPEND_SUBSCRIPTION_FAIL, payload: message });
              })
          } else {
            message = [ "Suspension Unsuccessfull", "Please check your connection, or contact support if this problem contunues." ];
            dispatch({ type: SUSPEND_SUBSCRIPTION, payload: message });
          }
        })
      })
    } catch(err) {
      message = [ "Subscription Suspended", "" ];
      dispatch({ type: SUSPEND_SUBSCRIPTION_FAIL, payload: message });
    }
  }
}

export const fetchInvoices = () => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    try {
      firebase.firestore().collection('users').doc(user.uid)
        .get().then((doc) => {
            var stripeId = doc.data().stripeId;
            var customerId = doc.data().customerId;
          firebase.firestore().collection('customers')
            .doc(customerId).collection('payment_succeeded')
              .get.then((querySnap) => {
                querySnap.forEach((doc) => {

                })
              })

          firebase.firestore().collection('customers')
            .doc(customerId).collection('payment_succeeded')
        })
    } catch(err) {
      console.log('err fetching invoices')
    }
  }
}

export const fetchPaymentHistory = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_PAYMENT_HISTORY })
    var invoices = [];
    try {
      const user = firebase.auth().currentUser;
      firebase.firestore().collection('users').doc(user.uid)
        .collection('payments').get().then((querySnap) => {
          if (querySnap.empty) {
            var invoiceData = {
              invoices: invoices,
              empty: true,
            }
            dispatch({
              type: FETCH_PAYMENT_H_SUCCESS,
              payload: invoiceData,
            })
          }

          querySnap.forEach((doc) => {
            var total = doc.data().payment.amount / 100;
            const invoice = {
              total: total,
              paid_at: formatDate(doc.data().payment.created),
              type: 'Lesson Credits',
              key: doc.data().payment.id,
            }
            invoices.push(invoice);
            var invoiceData = {
              invoices: invoices,
              empty: false,
            }
            dispatch({
              type: FETCH_PAYMENT_H_SUCCESS,
              payload: invoiceData
            })
          })
        })
      firebase.firestore().collection('users').doc(user.uid)
          .collection('invoices').get()
            .then((querySnap) => {
              if (querySnap.empty) {
                var invoiceData = {
                  invoices: invoices,
                  empty: true,
                }
                dispatch({
                  type: FETCH_PAYMENT_H_SUCCESS,
                  payload: invoiceData,
                })
              }

              querySnap.forEach((doc) => {
                var total = doc.data().invoice.total / 100;
                const invoice = {
                  total: total,
                  paid_at: formatDate(doc.data().invoice.paid_at),
                  type: 'Subscription',
                  key: doc.data().invoice.id,
                }

                invoices.push(invoice);
                var invoiceData = {
                  invoices: invoices,
                  empty: false,
                }
                dispatch({
                  type: FETCH_PAYMENT_H_SUCCESS,
                  payload: invoiceData,
                })
              })
            })
    } catch(err) {
      dispatch({ type: FETCH_PAYMENT_H_FAILED });
    }
  }
}

const formatDate = (date) => {
  if (date != '' && date != undefined) {
    var d = new Date(0);
    d.setUTCSeconds(date);
    const _date = moment().format("LL")
    return _date
  }
}

export const saveCard = (cardInfo, customerId,) => {
  return (dispatch) => {
    const tokenUrl = 'https://api.stripe.com/v1/tokens';
    var { name, number, exp_month, exp_year, cvc, address_zip, } = cardInfo;

    const info = {
      "card[currency]": "usd",
      'card[name]': name,
      'card[number]': number,
      'card[exp_month]': exp_month,
      'card[exp_year]': exp_year,
      'card[cvc]': cvc,
      'card[address_zip]': address_zip,
    }
    const formBody = encoder(info)

      try {
        fetch(tokenUrl, {
          method: 'post',
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
          }),
          body: formBody,
        }).then((resp) => {
          resp.json().then((solved) => {
            if (solved.error) {
              console.log('STRIPE_TOK_FAILED', solved)
              return dispatch({ type: STRIPE_TOK_FAILED });
            }
            console.log('got token')
            const token = solved.id
            const user = firebase.auth().currentUser;
            firebase.firestore().collection('coaches').doc(user.uid)
              .get().then((doc) => {
                const stripeAccount = doc.data().connectAccountId

                requestSaveCard(token, stripeAccount)
              })
          })
        }).catch((err) => console.log('STRIPE_TOK_FAILED', err))
      } catch(err) {
        dispatch({ type: STRIPE_TOK_FAILED })
      }
  }
}

const requestSaveCard = (token, stripeAccount) => {
  const card = {
    'external_account': token,
  }

  const formBody = encoder(card)
  const stripeUrl = `https://api.stripe.com/v1/accounts/${stripeAccount}/external_accounts`

  try {
    fetch(stripeUrl, {
      method: 'post',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
      }),
      body: formBody,
    }).then((resp) => {
      resp.json().then((solved) => {
        console.log('solved', solved)
        const cardId = solved.id
        const user = firebase.auth().currentUser
        firebase.firestore().collection('coaches').doc(user.uid)
          .update({
            cardId: cardId,
          }).then(() => {
            console.log('done')
          })
      })
    })
  } catch(err) {
    console.log('err adding bank')
  }
}

export const saveBank = (bankInfo, connectAccount) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    try {
      firebase.firestore().collection('coaches').doc(user.uid)
        .get().then((doc) => {
          const connectAccount = doc.data().connectAccountId
          bankToken(connectAccount, bankInfo)
          // requestBankChanges(bankInfo, connectAccount)
        })
    } catch(err) {
      console.log('SAVEBANK', err)
    }
  }
}

const bankToken = (connectAccount, bankInfo) => {
  const { holderName, accountNumber, routingNumber } = bankInfo
  console.log(bankInfo)
  const bankAccount = {
    "bank_account[object]": "bank_account",
    "bank_account[account_holder_name]": holderName,
    "bank_account[account_holder_type]": "individual",
    "bank_account[currency]": "usd",
    "bank_account[country]": "US",
    "bank_account[routing_number]": routingNumber,
    "bank_account[account_number]": accountNumber,
  }
  console.log('stripe', STRIPE_SECRET)

  const formBody = encoder(bankAccount)
  const tokenUrl = 'https://api.stripe.com/v1/tokens'
  try {
    fetch(tokenUrl, {
      method: 'post',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
      }),
      body: formBody,
    }).then((resp) => {
      resp.json().then((solved) => {
        const token = solved.id
        console.log('solved', solved)
        requestBankChanges(token, connectAccount)
      })
    })
  } catch(err) {
    console.log('err', err)
  }
}

//Banks And Cards (Stripe)
const requestBankChanges = (token, connectAccount) => {
    const stripeUrl = `https://api.stripe.com/v1/accounts/${connectAccount}/external_accounts`
    const info = {
      "external_account": token
    }
    const formBody = encoder(info)
    try {
      fetch(stripeUrl, {
        method: 'post',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
        }),
        body: formBody,
      }).then((resp) => {
        resp.json().then((solved) => {
          console.log('solved', solved)
          const bankId = solved.id
          const user = firebase.auth().currentUser
          firebase.firestore().collection('coaches').doc(user.uid)
            .update({
              bankId: bankId,
            }).then(() => {
              console.log('done')
            })
        })
      })
    } catch(err) {
      console.log('err adding bank')
    }
}

//Payout (Stripe)
export const createCoachStripeAcc = (personal, address) => {
  const { city, line1, line2, zip, state } = address
  const { firstName, lastName, birth, ssn } = personal
  _birth = birth.split('/')
  var day = _birth[0]
  var month = _birth[1]
  var year = _birth[2]

  const accountInfo = {
    "country": "US",
    "type": "custom",
    "legal_entity.address.city": `${city}`,
    "legal_entity.address.line1": `${line1}`,
    "legal_entity.address.line2": `${line2}`,
    "legal_entity.address.postal_code": `${zip}`,
    "legal_entity.address.state	": `${state}`,
    "legal_entity.dob.day": `${day}`,
    "legal_entity.dob.month": `${month}`,
    "legal_entity.dob.year": `${year}`,
    "legal_entity.first_name": `${firstName}`,
    "legal_entity.last_name": `${lastName}`,
    "legal_entity.ssn_last_4": `${ssn}`,
    "legal_entity.type": "individual",
  }
  const stripeUrl = `https://api.stripe.com/v1/accounts`

  const formBody = encoder(accountInfo)

  try {
    fetch(stripeUrl, {
      method: 'post',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ base64.btoa(STRIPE_SECRET),
      }),
      body: formBody,
    }).then((resp) => {
      resp.json().then((solved) => {
        const id = solved.id

        firebase.firestore().collection('coaches').doc(user.uid)
          .update({
            stripeAccount: id,
          }).then(() => {
            console.log('created connect user')
          }).catch((err) => {
            console.log('err')
          })
      })
    })
  } catch(err) {
    console.log('err', err)
  }

}

export const createPlan = (amount, credits) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    const chargebeeUrl = `https://${CHARGEBEE_SITE_URL}/api/v2/plans`
    const invoiceName = 'Custom Credits Subscription'
    const name = `${credits}_${user.uid}`
    var price = Number(amount) * 100
    const now = moment().format("MM.DD.hh.mm")
    const id = `${credits}.${user.uid}.${now}`

    const planInfo = {
      "id": `${id}`,
      "name": `${name}`,
      "invoice_name": `${invoiceName}`,
      "price": `${price}`,
    }

    const formBody = encoder(planInfo)

    try {
      fetch(chargebeeUrl, {
        method: 'post',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
        }),
        body: formBody,
      }).then((response) => {
        response.json().then((solved) => {
          if (solved.api_error_code == 'duplicate_entry') {
            return deletePlan(id, amount, credits);
          }
          console.log('solved', solved)
          const planId = solved.plan.id
          subscribeUser(planId, credits, dispatch)
        })
      })
    } catch(err) {
      dispatch({ type: CREATE_SUBSCRIPTION_FAILURE })
    }
  }
}

const deletePlan = (id, amount, credits) => {
      const chargebeeUrl = `https://${CHARGEBEE_SITE_URL}/api/v2/plans/${id}/delete`
      try {
        fetch(chargebeeUrl, {
          method: 'post',
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+ base64.btoa(CHARGEBEE_API_KEY),
          })
        }).then((resp) => {
          resp.json().then((solved) => {
            console.log('plan deleted', solved)
            createPlan(amount, credits)
          })
        })
      } catch(err) {
        console.log('deletePlan', err)
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
