import { Actions } from 'react-native-router-flux';
import {
  UPDATE_SUCCESS,
  SAVE_PROFILE,
  FETCH_PROFILE,
  FETCH_PROFILE_FAILED,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAIL,
  USER_DEL_ERROR,
  USER_DEL_SUCCESS,
  ACTIVATE_ACC_SUCCESS,
  ACTIVATE_ACC_FAIL,
  SET_AVAILIBILITY,
  SA_SUCCESS,
  SA_FAIL,
  FETCH_SUBSCRIPTION,
  FETCH_SUBSCRIPTION_FAILED,
  FETCH_SUBMITTED_DOCS_SUCCESS,
  QUERY_SCHOOLS,
  QUERY_SCHOOLS_FAILED,
  FETCH_ACTIVE_PREPS,
  FETCH_ACTIVE_PREPS_FAILED,
  ADD_NEW_PREP,
  ADD_NEW_PREP_FAILED,
  SWITCH_PREP,
  SWITCH_PREP_FAILED,
  REPORT_USER_FAIL,
  REPORT_USER_SUCCESS,
} from './types';
import firebase from 'react-native-firebase';

import {
  GOOGLE_PLACES_API_KEY
} from '../config'

export const fetchProfile = () => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    if (!user) {
      return;
    }
    firebase.firestore().collection('users').doc(user.uid)
    .onSnapshot((doc, onError) => {
      if (onError) {
        return dispatch({ type: FETCH_PROFILE_FAILED })
      }

      if (doc.exists) {
        const { name, email, phone, credits, subscription, currentPrep } = doc.data();
        const uInfo = {
          name,
          email,
          phone,
          credits,
          subscription,
          userId: doc.id,
          currentPrep: currentPrep,
          role: 'Parent'
        }
        dispatch({ type: FETCH_PROFILE, payload: uInfo })
      } else {
        firebase.firestore().collection('coaches').doc(user.uid)
        .onSnapshot((doc, onError) => {
          if (onError) {
            return dispatch({ type: FETCH_PROFILE_FAILED })
          }

          if (doc.exists) {
            var role = 'Coach';
            let userInfo = doc.data()
            userInfo.userId = doc.id
            userInfo.role = role
            dispatch({ type: FETCH_PROFILE, payload: userInfo })
          }
        })
      }
    })
  }
}

export const saveProfile = ( info, coach, location, guardian, pricing, zip ) => {
  const user = firebase.auth().currentUser;

  return (dispatch) => {
    dispatch({ type: SAVE_PROFILE });

    if (coach) {
      const {
          subject, experience, reason, highSchool,
      } = coach
      const { city, _state } = location
      const { email, phone, name } = info
      const { guardianEmail, guardianPhone, guardianName } = guardian
      return firebase.firestore().collection('coaches')
      .doc(user.uid).update({
        email: email,
        phone: phone,
        name: name,
        guardianEmail: guardianEmail,
        guardianName: guardianName,
        guardianPhone: guardianPhone,
        city: city,
        _state: _state,
        subject: subject,
        experience: experience,
        reason: reason,
        highSchool: highSchool,
        sessionPrice: pricing,
      }).then(() => {
        findGeoLoc(zip)
        user.updateEmail(email).catch(() => console.log('email failed'))
        var message = "Changes Saved!";
        dispatch({ type: SAVE_PROFILE_SUCCESS, payload: message });
      }).catch(() => dispatch({type: SAVE_PROFILE_FAIL}))
    } else {
      const { email, parentName, phone } = info;
      firebase.firestore().collection('users').doc(user.uid).update({
        email: email,
        phone: phone,
        name: parentName,
      }).then(() => {
        return user.updateEmail(email)
      }).then(() => {
        var message = "Changes Saved!";
        dispatch({ type: SAVE_PROFILE_SUCCESS, payload: message });
      }).catch(() => {
        dispatch({type: SAVE_PROFILE_FAIL});
      })
    }
  }
}

const findGeoLoc = (zip) => {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_PLACES_API_KEY}`
  let user = firebase.auth().currentUser
  fetch(url).then((res) => res.json())
  .then((solved) => {
    if (!solved.ok) {
      return resp;
    }
    
    let _geoloc = solved.results[0].geometry.location
    return firebase.firestore().collection('coaches')
    .doc(user.uid).update({
      _geoloc: _geoloc,
    })
  }).catch((err) => console.log(err))
}

export const changePassword = (oldPassword, newPassword) => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {

    user.updatePassword(newPassword).then(() => {
      dispatch({ type: UPDATE_SUCCESS });
    }).catch(() => {
      user.reauthenticateWithCredential(user.email, oldPassword).then(() => {
        // User re-authenticated.
      }).catch(() => {
        // An error happened.
      })
    })
  }
}

export const activateAccount = () => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    if (user) {
      firebase.firestore().collection('coaches').doc(user.uid)
        .update({
          activated: true,
        }).then(() => {
          dispatch({ type: ACTIVATE_ACC_SUCCESS })
        }).catch(() => {
          dispatch({ type: ACTIVATE_ACC_FAIL })
        })
    }
  }
}

export const deactivateAccount = () => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    if (!user) {
      return dispatch({ type: ACTIVATE_ACC_FAIL })
    }

    firebase.firestore().collection('coaches').doc(user.uid)
    .update({
      activated: false,
    }).then(() => {
      dispatch({ type: ACTIVATE_ACC_SUCCESS });
    }).catch(() => {
      dispatch({ type: ACTIVATE_ACC_FAIL });
    })
  }
}

export const deleteProfile = () => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    if (!user) { 
      return dispatch({ type: USER_DEL_ERROR })
    }
    
    user.delete().then(() => {
      dispatch({ type: USER_DEL_SUCCESS });
      Actions.welcome()
    }).catch(() => {
      dispatch({ type: USER_DEL_ERROR });
    })
  }
}

export const blockUser = (prepInfo) => {
  return (dispatch) => {
    let user = firebase.auth().currentUser
    const { prepUid, email } = prepInfo

    //delete all referencs to both users
    try {
      firebase.firstore().collection('users').doc(user.uid)
      .collection('blocked_users').add({
        uid: prepUid,
        prepEmail: email,
      }).then(() => {

      })

      firebase.firstore().collection('users').doc(prepUid)
      .collection('blocked_users').add({
        uid: user.uid,
      }).then(() => {

      })
    } catch(err) {
      console.log('err', err)
    }
  }
}

export const unblockUser = (prepInfo) => {
  return (dispatch) => {
    let { uid } = prepInfo 
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users')
    .doc(user.uid).collection('blocked_users')
    .doc(uid).delete().catch(() => {

    })
  }
}

export const fetchBlockedUser = () => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
      .collection('blocked_users').get().then((querySnap) => {
        if (querySnap.empty) {
          console.log('no blocked users')
          return;
        }

        querySnap.forEach((doc) => {
          // do stuff
        })
      })
    } catch(err) {
      console.log('err' ,err);
    }
  }
}

export const setAvailibility = (availibility) => {
  var user = firebase.auth().currentUser
  return (dispatch) => {
    dispatch({ type: SET_AVAILIBILITY })

    firebase.firestore().collection('coaches').doc(user.uid)
    .update({
      availability: availibility,
    }).then(() => {
      dispatch({ type: SA_SUCCESS })
    }).catch(() => {
      dispatch({ type: SA_FAIL })
    })
  }
}

export const fetchSubscription = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid)
    .onSnapshot((doc, onError) => {
      if (onError) {
        return dispatch({ type: FETCH_SUBSCRIPTION_FAILED })
      }

      if (!doc.data().plan) {
        const subscription = {
          status: 'cancelled',
        }
        dispatch({ type: FETCH_SUBSCRIPTION, payload: subscription })
      }
      
      var subscription = doc.data().plan;
      dispatch({ type: FETCH_SUBSCRIPTION, payload: subscription });
    })
  }
}

export const fetchUser = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('users').doc(user.uid)
    .get().then((doc) => {
      const user = {
        name: doc.data().name,
        email: doc.data().email,
        phone: doc.data().phone,
      }
      dispatch({ type: FETCH_PROFILE, payload: user })
    }).catch(() => {
      dispatch({ type: FETCH_PROFILE_FAILED })
    })
  }
}

export const fetchSubmittedDocs = () => {
  return (dispatch) => {
  const user = firebase.auth().currentUser
    firebase.firestore().collection("coaches").doc(user.uid)
    .get().then((doc) => {
      const submittedDocs = {
        tosAccepted: doc.data().tosAccepted,
        idSubmitted: doc.data().idSubmitted,
        personalInfoSubmitted: doc.data().personalInfoSubmitted
      }
      
      dispatch({ type: FETCH_SUBMITTED_DOCS_SUCCESS, payload: submittedDocs})
    }).catch((err) => console.log('FETCH_SUBMITTED_DOCS_FAILED', err))
  }
}

export const queryAllSchools = () => {
  return (dispatch) => {
    try {
      firebase.firestore().collection('schools')
      .get().then((querySnap) => {
        if (querySnap.empty) {
          let schoolInfo = {empty: true, schools: []}
          return dispatch({ type: QUERY_SCHOOLS, payload: schoolInfo })
        }

        let schools = []
        querySnap.forEach((doc) => {
          var school = doc.data()
          schools.push(school)
          let schoolInfo = { empty: false, schools: schools }
          dispatch({ type: QUERY_SCHOOLS, payload: schoolInfo })
        })
      })
    } catch(err) {
      dispatch({ type: QUERY_SCHOOLS_FAILED })
    }
  }
}

export const querySchoolsByCity = (city_state) => {
  return (dispatch) => {
    try {
      firebase.firestore().collection('schools')
      .where("city_state", "==", city_state).get()
      .then((querySnap) => {
        if (querySnap.empty) {
          let schoolInfo = {empty: true, schools: []}
          return dispatch({ type: QUERY_SCHOOLS, payload: [] })
        }

        let schools = []
        querySnap.forEach((doc) => {
          var school = doc.data()
          schools.push(school)
          let schoolInfo = { empty: false, schools: schools }
          dispatch({ type: QUERY_SCHOOLS, payload: schoolInfo })
        })
      })
    } catch(err) {
      dispatch({ type: QUERY_SCHOOLS_FAILED })
    }
  }
}

export const fetchPreps = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid)
    .collection('preps').onSnapshot((querySnap) => {
      if (querySnap.empty) {
        const prepsInfo = { empty: true, preps: [] }
        return dispatch({ type: FETCH_ACTIVE_PREPS, payload: prepsInfo })
      }

      let preps = []
      querySnap.forEach((doc) => {
        let prep = doc.data()
        prep.prepUid = doc.id

        preps.push(prep)
        const prepInfo = { empty: false, preps: preps }
        dispatch({ type: FETCH_ACTIVE_PREPS, payload: prepInfo })
      })
    }, () => dispatch({ type: FETCH_ACTIVE_PREPS_FAILED }))
  }
}

export const fetchCurrentPrep = () => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    return firebase.firestore().collection('users').doc(user.uid)
    .onSnapshot((doc, onError) => {
      if (onError) {
        return dispatch({ type: ADD_NEW_PREP_FAILED })
      }

      let currentPrep = doc.data().currentPrep
      dispatch({ type: ADD_NEW_PREP, payload: currentPrep })
    })
  }
}


export const createPrep = (prep) => {
  // create document in preps collection
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users').doc(user.uid)
    .collection('preps').add(prep).then((doc) => {
      prep.prepUid = doc.id
      return firebase.firestore().collection('users')
      .doc(user.uid).update({
        currentPrep: prep,
      })
    }).then(() => {
      dispatch({ type: ADD_NEW_PREP, payload: prep })
    }).catch((err) => console.log('err', err))
  }
}

export const switchPrep = (prep) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users').doc(user.uid)
    .update({
      currentPrep: prep,
    }).then(() => {
      dispatch({ type: SWITCH_PREP, payload: prep })
    }).catch(() => {
      dispatch({ type: SWITCH_PREP_FAILED })
    })
  }
}

export const reportUser = (report) => {
  return (dispatch) => {
    firebase.auth().currentUser
    firebase.firestore().collection('reports')
    .add({
      report,
    }).then(() => {
      dispatch({ type: REPORT_USER_SUCCESS })
    }).catch(() => {
      dispatch({ type: REPORT_USER_FAIL })
    })
  }
}

export const  removeMentor = (id) => {
  const user = firebase.auth().currentUser

  firebase.firestore().collection('users')
  .doc(user.uid).collection('mentors')
  .doc(id).delete()
  .catch((err) => {
    console.log(err)
  })
}