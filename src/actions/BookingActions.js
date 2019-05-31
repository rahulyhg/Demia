import { Actions } from 'react-native-router-flux';
import {
  BOOKING_SUCCESS,
  BOOKING_FAIL,
  SCHEDULE_FAILED,
  ATTEMPT_SCHEDULE,
  RATING,
  RATING_FAILED,
  RATING_SUCCESS,
  ADD_MENTOR,
  ADD_MENTOR_FAILED,
} from './types';
var _ = require('lodash')
import firebase from 'react-native-firebase';
import moment from 'moment'
import { makeCharge, transferFundsToCoach } from './PaymentActions'
const uuidv1 = require('uuid/v1')

export const purchaseSession = (lessonInfo) => {
 return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('users')
      .doc(user.uid).get().then((doc) => {
        const stripeCustomer = doc.data().stripeId
        let { price } = lessonInfo
        price = price + '00'

        let info = {
          amount: price,
          customer: stripeCustomer,
          currency: 'usd',
          description: `Charged for 1 tutoring session`,
        }

        makeCharge(info, dispatch)
        bookLesson(lessonInfo, dispatch)
      })
    } catch(err) {
      dispatch({ type: BOOKING_FAIL })
    }
  }
}

//used in above in makePayment, makeFakePayment
const bookLesson = (lessonInfo, dispatch) => {
  const { prep, price, user, coach, coachId, lesson } = lessonInfo
  if (coach && coachId) {
    let threadId = uuidv1()
    addMentor(coach, coachId, user, threadId, dispatch)
  }

  let _date = new Date()
  const _user = firebase.auth().currentUser
  var id = uuidv1()

  firebase.firestore().collection('users').doc(_user.uid)
  .collection('lessons').add({
    id: id,
    date: _date,
    user: user,
    prep: prep,
    sessionPrice: price,
    coachId: coachId,
    coach: coach.name,
    coachPicture: coach.picture,
    coachEmail: coach.email,
    coachPhone: coach.phone,
    guardianPhone: coach.guardianPhone,
    guardianName: coach.guardianName,
    scheduled: false,
    lesson: lesson,
    requestChange: false,
    paid: false,
  }).then(() => bookingSuccess(dispatch))
  .catch(() => bookingFail(dispatch))

  firebase.firestore().collection('coaches').doc(coachId)
  .collection('lessons').add({
    id: id,
    user: user,
    prep: prep,
    sessionPrice: price,
    lesson: lesson,
    userId: _user.uid,
    scheduled: false,
    requestChange: false,
    paid: false,
  }).then(() => bookingSuccess(dispatch))
  .catch(() => bookingFail(dispatch))
}

export const addMentor = (coach, coachId, user, threadId, dispatch) => {
  //set up the data structures for mentor/user
  let forUser = {
    mentor: {
      coachId: coachId,
      coach: coach.name,
      picture: coach.picture,
      coachEmail: coach.email,
      coachPhone: coach.phone,
      thread: threadId
    }
  }
  let forMentor = {
    parentName: user.parentName,
    parentEmail: user.email,
    parentPhone: user.phone,
  }

  //Set up the references
  const _user = firebase.auth().currentUser
  let userRef = firebase.firestore().collection('users').doc(_user.uid)
  .collection('mentors').doc(coachId)
  let mentorRef = firebase.firestore().collection('coaches').doc(coachId)
  .collection('threads').doc(_user.uid)
  
  //Make the calls
  userRef.update(forUser).then(() => {
    dispatch({ type: ADD_MENTOR })
  }).catch(err => mentorFailed(err, userRef, forUser))
  mentorRef.update(forMentor)
  .catch(err => mentorFailed(err, mentorRef, forMentor))

  //Handle the errors (If the doc doesn't exist already)
  const mentorFailed = (err, ref, data) => {
    setMentor(ref, data, dispatch)
    dispatch({ type: ADD_MENTOR_FAILED })
    console.log('err', err)
  }
}

const setMentor = (ref, data, dispatch) => {
  ref.set(data).then(() => {
    console.log('set mentor/user info')
    dispatch({ type: ADD_MENTOR })
  }).catch((err) => {
    console.log(err)
    dispatch({ type: ADD_MENTOR_FAILED })
  })
}

//To schudele unschedules practices. Used in ScheduleModal
export const schedulePractice = (info) => {
  return (dispatch) => {
    const { id, date, coachId, price, formattedDate, notes, location } = info
    dispatch({ type: ATTEMPT_SCHEDULE })
    const user = firebase.auth().currentUser
    const completedBy = moment(date).add(1, 'day').format()

    try {
      firebase.firestore().collection('users').doc(user.uid)
      .collection('lessons').where("scheduled", "==", false)
      .where("id", "==", id).get().then(querySnap => {
        if (querySnap.empty == true) {
          dispatch({ type: SCHEDULE_FAILED })
        }
        querySnap.forEach(doc => {
          firebase.firestore().collection('users').doc(user.uid)
          .collection('lessons').doc(doc.id).update({
            scheduled: true,
            date: date,
            formattedDate: formattedDate,
            notes: notes,
            location: location,
            completedBy: completedBy,
            paid: false,
            review: false,
          }).catch((err) => {
            dispatch({ type: SCHEDULE_FAILED })
          })
        })
      })

        firebase.firestore().collection('coaches').doc(coachId)
        .collection("lessons")
        .where("id", "==", id).get().then(querySnap => {
          if (querySnap.empty == true) {
            dispatch({ type: SCHEDULE_FAILED });
          }
          querySnap.forEach(doc => {
          firebase.firestore().collection("coaches")
          .doc(coachId).collection("lessons").doc(doc.id)
          .update({
            scheduled: true,
            date: date,
            formattedDate: formattedDate,
            notes: notes,
            location: location,
            completedBy: completedBy,
            paid: false,
            review: false,
          }).then(() => {
            transferFundsToCoach(coachId, price, dispatch)
          }).catch((err) => {
            dispatch({ type: SCHEDULE_FAILED });
          })
        })
      })
    } catch(err) {
      dispatch({ type: SCHEDULE_FAILED });
    }
  }
}

export const rateCoach = (rating, coachUid ) => {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    dispatch({ type: RATING });
    firebase.firestore().collection("coaches").doc(coachUid)
    .collection("reviews").add({
      rating: rating.stars,
      title: rating.title,
      review: rating.review,
      ratedBy: user.uid,
      submitted: rating.submitted,
      submittedBy: rating.submittedBy,
      changeCount: 0,
    }).then(() => {
      const message = "Rating Submitted";
      dispatch({ type: RATING_SUCCESS, payload: message });
      averageRatings(coachUid);
    }).catch((err) => {
      const message = "Rating Failed";
      dispatch({ type: RATING_FAILED, payload: message });
    })
  }
}

const averageRatings = (coachUid) => {
  var ratings = []
  var average = 0;
  firebase.firestore().collection('coaches').doc(coachUid)
  .collection('reviews').get().then((querySnap) => {
    querySnap.forEach((doc) => {
      var rating = doc.data().rating
      ratings.push(rating)
      var total = ratings.reduce((a, b) => a + b)
      var div = ratings.length
      average = total / div
    })
    setTimeout(() => saveRatings(average, coachUid), 50)
  }).catch((err) => {
    console.log('err averaging', err)
  })
}

const saveRatings = (average, coachUid) => {
  firebase.firestore().collection('coaches').doc(coachUid)
  .update({
    rating: average,
  }).catch(() => {
    console.log('something happened')
  })
}

const bookingSuccess = (dispatch) => {
  dispatch({ type: BOOKING_SUCCESS });
  console.log('booking success')

  Actions.createLesson()
  Actions.schedule({ message: true, stay: true });
}

const bookingFail = (dispatch) => {
  dispatch({ type: BOOKING_FAIL });
};

