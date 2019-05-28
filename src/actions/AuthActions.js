import { Actions } from "react-native-router-flux"
import {
  NAME_CHANGED,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_CHNAGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  LOGIN_USER,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  SAVE_PHOTO_ID,
  SAVE_PHOTO_ID_FAULIRE,
  ADD_NEW_PREP,
  ADD_NEW_PREP_FAILED,
  CHECK_NETWORK
} from "./types"
import firebase from "react-native-firebase"
import base64 from '../util/base64';
import  {
  STRIPE_PUBLISHABLE,
 } from '../config'

//used in manage profile
export const nameChanged = text => {
  return {
    type: NAME_CHANGED,
    payload: text
  }
}


//used in manage profile
export const emailChanged = text => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  }
}

//used in manage profile
export const passwordChanged = text => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  }
}

//used in manage profile
export const confirmChanged = text => {
  return {
    type: CONFIRM_CHNAGED,
    payload: text
  }
}

//used in loginUser
export const loginUser = ({ email, password }, fcmToken) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER })
    try {
      firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user)
          user = user.user
          saveApnToken(fcmToken, user)
          loginUserSuccess(dispatch, user)
        }).catch(err => {
          loginUserFail(dispatch, err)
        })
    } catch (err) {
      loginUserFail(dispatch, err)
    }
  }
}

//used in Signup
export const signupUser = ({
  name, email, password, numOfLessons,
  price, coach, lesson, boo, uid, role
}, fcmToken) => {
  if (boo == true) {
    booking = {
      numOfLessons: numOfLessons,
      price: price,
      coach: coach,
      lesson: lesson,
      booking: true,
      boo: boo,
      coachId: uid,
      role: "Parent"
    }
  }

  return dispatch => {
    dispatch({ type: SIGNUP_USER })
    var today = new Date()
    var subscription = {
      isActive: false
    }
    let currentPrep = {
      name: name,
    }

    try {
      if (role == "Coach") {
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
        .then(user => {
          const coachId = user._user.uid
          firebase.firestore().collection("coaches").doc(user._user.uid)
          .set({
            email: email,
            phone: "",
            name: name,
            id: coachId,
            role: "Coach",
            activated: false,
            joined: today,
            tosAccepted: false,
            parentDoc: false,
            rating: 5,
            counselorDoc: false,
            idPic: false,
            apn_token: fcmToken,
          }).then(() => {
            signupUserSuccess(user, dispatch, role)
          }).catch((err) => console.log('SIGNUP_USER', err))
        }).catch(err => {
          signupUserFail(dispatch, err)
        })
      } else if (role == "Parent") {
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
        .then(user => {
          firebase.firestore().collection("users")
            .doc(user._user.uid).set({
              email: email,
              phone: "",
              name: name,
              unscheduled: 0,
              role: "Parent",
              joined: today,
              credits: 0,
              plan: subscription,
              currentPrep: currentPrep,
              apn_token: fcmToken,
            }).then(() => {
              createPrep(name, email)
              signupUserSuccess(user, dispatch, role, boo, coach, user._user.uid)
            })
        }).catch(err => {
          signupUserFail(dispatch, err)
        })
      }
    } catch(err) {
      console.log('err', err)
    }
  }
}

const createPrep = (name, email) => {
  let prep = {
    name: name,
    email: email,
    badgeLevel: 0,
    dob: "",
    grade: "",
    levelPoints: 0,
    nickname: "",
  }
  const user = firebase.auth().currentUser
  firebase.firestore().collection('users').doc(user.uid)
  .collection('preps').add(prep).then((doc) => {
    prep.prepUid = doc.id
    return firebase.firestore().collection('users').doc(user.uid)
    .update({
      currentPrep: prep,
    })
  }).then(() => {
    dispatch({ type: ADD_NEW_PREP, payload: prep })
  }).catch(() => dispatch({ type: ADD_NEW_PREP_FAILED }))
}

const loginUserFail = (dispatch, err) => {
  dispatch({ type: LOGIN_USER_FAILED, payload: err })
}

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  })

  firebase.firestore().collection("users").doc(user.uid)
    .get().then(doc => {
      if (doc.exists) {
        Actions.book({ profile: user, role: "user" })
      } else {
        // console.log('user', user)
        Actions.locker({ profile: user, role: "coach" })
      }
    })
}

const signupUserSuccess = (user, dispatch, role, boo, coach, coachId) => {
  if (boo) {
    dispatch({ type: SIGNUP_USER_SUCCESS })

    Actions.bookingSignup({
      user: user._user,
      numOfLessons: this.booking.numOfLessons,
      price: this.booking.price,
      coach: this.booking.coach,
      coachId: this.booking.coachId,
      lesson: this.booking.lesson,
      role: role
    })
  }

  dispatch({ type: SIGNUP_USER_SUCCESS, payload: user })
  if (role == "Parent") {
    Actions.book({ role: "user" })
  } else {
    Actions.coachTabs({ role: "coach" })
  }
}

const signupUserFail = (dispatch, err) => {
  dispatch({ type: SIGNUP_USER_FAIL, payload: err })
}

//used in manageProfile
export const logoutUser = dispatch => {
  return dispatch => {
    dispatch({ type: LOGOUT_USER })

    firebase.auth().signOut().then(() => {
        logoutUserSuccess(dispatch)
      }).catch(err => {
        logoutUserFail(dispatch)
      })
  }
}

const logoutUserFail = dispatch => {
  dispatch({ type: LOGOUT_USER_FAIL })
}

const logoutUserSuccess = dispatch => {
  dispatch({ type: LOGOUT_USER_SUCCESS })
  Actions.welcome()
}

export const sendPhotoId = photoId => {
  return dispatch => {
    dispatch({ type: SAVE_PHOTO_ID })
    console.log(photoId)
    const tokenUrl = "https://files.stripe.com/v1/files"
    const { photoIdPath } = photoId
    const info = {
      "purpose": "identity_document",
      "file": `@${photoIdPath}}`
    }

    var formBody = []
    for (var property in info) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(info[property])
      formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")
    fetch(tokenUrl, {
      method: "post",
      headers: new Headers({
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + base64.btoa(STRIPE_PUBLISHABLE)
      }),
      body: formBody
    }).then((res) => res.json())
    .then(solved => {
      if (solved.error) {
        dispatch({ type: STIPE_TOK_FAILED })
      }
      const fileId = solved.id
      savePhotoId(dispatch, account_id, fileId)
    })
  }
}

const savePhotoId = (dispatch, account_id, fileId) => {
  const tokenUrl = `https://api.stripe.com/v1/accounts/${account_id}`
  const info = {
    "legal_entity.document": `${fileId}`
  }

  var formBody = []
  for (var property in info) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(info[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }
  formBody = formBody.join("&")

  fetch(tokenUrl, {
    method: "post",
    headers: new Headers({
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + base64.btoa(STRIPE_PUBLISHABLE)
    }),
    body: formBody
  }).catch(() => {
    dispatch({ type: SAVE_PHOTO_ID_FAULIRE })
  })
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

export const checkConnection = () => {
  return ( dispatch) => {
    fetch('https://www.google.com/').then((resp) => {
      probablyHasInternet = resp.status === 200 || resp.status === 503;
      dispatch({ type: CHECK_NETWORK, payload: probablyHasInternet })
    }).catch(() => {
      probablyHasInternet = false;
      dispatch({ type: CHECK_NETWORK, payload: probablyHasInternet })
    })
  }
}

export const saveApnToken = (token, user) => {
  firebase.firestore().collection('users')
  .doc(user.uid).update({ apn_token: token })
  .catch(() => {
    firebase.firestore().collection('coaches')
    .doc(user.uid).update({ apn_token: token })
  })
}
