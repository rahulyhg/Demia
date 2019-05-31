import {
  RETRIEVAL_FAIL,
  RETRIEVAL_SUCCESS,
  FETCH_PAYMENT_HISTORY,
  FETCH_PAYMENT_H_FAILED,
  FETCH_PAYMENT_H_SUCCESS,
  TOKEN_SENT,
  CHARGE_FAILED,
  PAYOUT_SUCCESS,
  PAYOUT_FAILURE,
} from './types';
import firebase from 'react-native-firebase';
import moment from 'moment';
var _ = require('lodash')

// All secret calls are made in functions

export const retrieveCard = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users')
    .doc(user.uid).get().then((doc) => {
      return doc.data().card

    }).then((card) => {
      dispatch({ type: RETRIEVAL_SUCCESS, payload: card })
    }).catch((err) => {
      console.log(err)
      dispatch({ type: RETRIEVAL_FAIL })
    })
  }
}

//used in components/profile/payment.js
export const fetchPaymentHistory = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_PAYMENT_HISTORY })
    var invoices = [];

    const user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid)
    .collection('payments').get().then((querySnap) => {
      if (querySnap.empty) {
        return dispatch({
          type: FETCH_PAYMENT_H_SUCCESS,
          payload: { invoices, empty: true }
        })
      }

      querySnap.forEach((doc) => {
        var total = doc.data().amount / 100;
        const invoice = {
          total: total,
          paid_at: formatDate(doc.data().created),
          type: 'Lesson Credits',
          key: doc.data().id,
        }
        invoices.push(invoice);
        var invoiceData = {
          invoices,
          empty: false,
        }
        return dispatch({ type: FETCH_PAYMENT_H_SUCCESS, payload: invoiceData })
      })
    }).catch((err) => {
      console.log(err)
      dispatch({ type: FETCH_PAYMENT_H_FAILED })
    })
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

export const saveCoachCard = (token) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('coaches')
    .doc(user.uid).collection('card_tokens')
    .add(token).catch((err) => {
      return err
    })
  }
}

export const saveBank = (bankInfo) => {
  return (dispatch) => {
    const { holderName, accountNumber, routingNumber } = bankInfo
    let bankAccount = {
      country: 'US',
      currency: 'usd',
      account_holder_name: holderName,
      account_holder_type: 'individual',
      routing_number: routingNumber,
      account_number: accountNumber
    }

    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches').doc(user.uid)
    .collection('bank_tokens').add(bankAccount).then(() => {
      dispatch({ type: TOKEN_SENT })
    }).catch((err) => {
      console.log('err', err)
    })
  }
}

export const saveUserCard = (card) => {
  return async (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users').doc(user.uid)
    .collection('card_tokens').add(card).then(() => {
      dispatch({ type: TOKEN_SENT })
    })
  }
}

export const makeCharge = (info, dispatch) => {  
  const user = firebase.auth().currentUser

  return firebase.firestore().collection('users')
  .doc(user.uid).collection('charges').add(info).then(() => {
  console.log('charge sent')
  }).catch((err) => {
    console.log(err)
    dispatch({ type: CHARGE_FAILED })
  })
}

export const transferFundsToCoach = (coachUid, price, dispatch) => {
  firebase.firestore().collection('coaches').doc(coachUid)
  .get().then((doc) => doc.data().connectAccountId)
  .then((connectAccountId) => {
    price = price * .85
    const amount = price + '00'
  
    let info = {
      "destination": `${connectAccountId}`,
      "currency": "usd",
      "amount": `${amount}`,
    }

    return firebase.firestore().collection('coaches')
    .doc(coachUid).collection('transfers').add(info)
  }).catch((err) => dispatch({ type: PAYOUT_FAILURE, payload: err }))
}

//Payout (Stripe)
export const payout = (amount, docIds) => {
  const user = firebase.auth().currentUser

  return (dispatch) => {
    firebase.firestore().collection('coaches')
    .doc(user.uid).collection('payouts').add({
      amount,
      docIds,
      currency: "usd",
    }).catch((err) => dispatch({ type: PAYOUT_FAILURE, payload: err}))
  }
}