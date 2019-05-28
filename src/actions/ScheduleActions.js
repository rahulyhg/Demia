import {
  R_R_FAILED,
  R_R_SUCCESS,
  RESCHEDULE_FAILED,
  RESCHEDULE_SUCCESS,
  FETCH_LESSONS_TO_RATE,
  FETCH_LESSONS_TO_RATE_SUCCESS,
  FETCH_LESSONS_TO_RATE_FAILURE,
  FETCH_LESSONS,
  FETCH_LESSONS_SUCCESS,
} from './types';
import firebase from 'react-native-firebase';
var _ = require('lodash')

export const fetchSchedule = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_LESSONS })
    const user = firebase.auth().currentUser;
    var lessons = [];
    firebase.firestore().collection('users').doc(user.uid).collection('lessons')
    .where("date", ">", new Date()).orderBy("date")
    .onSnapshot(querySnap => {
      if (querySnap.empty == true) {
        const lessonsInfo = {
          empty: true,
          lessons: []
        }

        return dispatch({ type: FETCH_LESSONS_SUCCESS, payload: lessonsInfo })
      }

      querySnap.forEach((doc) => {
        lessons.push(doc.data())
        lessons = _.uniqWith(lessons, _.isEqual)
      })

      dispatch({ type: FETCH_LESSONS_SUCCESS, payload: lessons })
    }, (err) => console.log(err))
  }
}

//used in CoachSchedule.js
export const requestReschedule = ( date, formattedDate, notes, practice ) => {
  const user = firebase.auth().currentUser;
  const parent = practice.userId;

  return (dispatch) => {
    try {
      firebase.firestore().collection('users').doc(parent)
      .collection('lessons').where("id", "==", practice.id)
      .get().then((querySnap) => {
        querySnap.forEach((doc) => {
          var id = doc.id;
          console.log('user doc data', doc.data());
          editParentDoc(id, date, formattedDate, notes, practice, dispatch);
        })
      })

      firebase.firestore().collection('coaches').doc(user.uid)
      .collection('lessons').where("id", "==", practice.id)
      .get().then((querySnap) => {
        querySnap.forEach((doc) => {
          var id = doc.id;
          console.log('coach doc data', doc.data());
          editCoachDoc(id, date, formattedDate, notes, practice, dispatch);
        })
      })
    } catch(err) {
      dispatch({ type: R_R_FAILED });
    }
  }
}

const editParentDoc = (userDocId, date, formattedDate, notes, practice, dispatch) => {
  const parent = practice.userId;

  firebase.firestore().collection('users').doc(parent)
  .collection('lessons').doc(userDocId)
  .update({
    requestChange: true,
    requestedNotes: notes,
    requestedDate: date,
    requestedFormattedDate: formattedDate,
  }).then(() => {
    dispatch({ type: R_R_SUCCESS });
  }).catch(() => {
    dispatch({ type: R_R_FAILED });
  })
}

const editCoachDoc = (coachDocId, date, formattedDate, notes, practice, dispatch) => {
  var user = firebase.auth().currentUser;

  firebase.firestore().collection('coaches').doc(user.uid)
    .collection('lessons').doc(coachDocId)
    .update({
      requestChange: true,
      requestedNotes: notes,
      requestedDate: date,
      requestedFormattedDate: formattedDate,
    }).then(() => {
      dispatch({ type: R_R_SUCCESS });
    }).catch(() => {
      dispatch({ type: R_R_FAILED });
    })
}

export const reschedule = (id, date, coachId, formattedDate, notes, practice) => {
  return (dispatch) => {
    user = firebase.auth().currentUser;
    console.log('id', id, 'coachId', coachId, 'practice', practice);

    try {
      firebase.firestore().collection('users').doc(user.uid)
      .collection('lessons').where("id", "==", id)
      .get().then((querySnap) => {
        querySnap.forEach((doc) => {
          const docId = doc.id;
          userReschedule(docId, date, user, formattedDate, notes, dispatch);
        })
      })
      firebase.firestore().collection('coaches').doc(coachId)
        .collection('lessons').where("id", "==", id)
          .get().then((querySnap) => {
            console.log('made coach request');
            querySnap.forEach((doc) => {
              const docId = doc.id;
              coachReschedule(docId, date, coachId, formattedDate, notes, dispatch);
            })
          })
    } catch(err) {
      console.log('err rescheduling' );
      dispatch({ type: RESCHEDULE_FAILED })
    }
  }
}

const coachReschedule = (docId, date, coachId, formattedDate, notes, dispatch) => {
  firebase.firestore().collection('coaches').doc(coachId)
  .collection('lessons').doc(docId)
  .update({
    notes: notes,
    date: date,
    formattedDate: formattedDate,
    requestChange: false,
    didChange: true,
  }).then(() => {
    dispatch({ type: RESCHEDULE_SUCCESS })
  }).catch((err) => {
    console.log('error coach rescheduling' );
    dispatch({ type: RESCHEDULE_FAILED })
  })
}

const userReschedule = (docId, date, user, formattedDate, notes, dispatch) => {
  firebase.firestore().collection('users').doc(user.uid)
  .collection('lessons').doc(docId)
  .update({
    notes: notes,
    date: date,
    formattedDate: formattedDate,
    requestChange: false,
    didChange: true,
  }).then(() => {
    dispatch({ type: RESCHEDULE_SUCCESS })
  }).catch((err) => {
    console.log('error user rescheduling' );
    dispatch({ type: RESCHEDULE_FAILED })
  })
}
// .where("rated", "==", false)
export const fetchLessonsToRate = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_LESSONS_TO_RATE })
    const user = firebase.auth().currentUser
    var lessons = []

    firebase.firestore().collection('users').doc(user.uid)
    .collection('lessons').where("scheduled", "==", true)
    .where("date", "<", new Date())
    .get().then((querySnap) => {
      if (querySnap.empty) {
        lessons = []
        lessonsInfo = {
          empty: true,
          lessons,
        }
        console.log('/fetch lessons to rate actions: empty')
        dispatch({ type: FETCH_LESSONS_TO_RATE_SUCCESS, payload: lessonsInfo })
      }
      querySnap.forEach((doc) => {
        lessons.push(doc.data())
        lessonsInfo = {
          empty: false,
          lessons,
        }
        dispatch({ type: FETCH_LESSONS_TO_RATE_SUCCESS, payload: lessonsInfo })
      })
    }).catch(err => {
      console.log('FETCH_LESSONS_TO_RATE_FAILURE', err);
      dispatch({ type: FETCH_LESSONS_TO_RATE_FAILURE })
    })
  }
}
