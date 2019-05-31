import {
  FETCH_MSGS,
  SEND_MSG,
  FETCH_MSGS_FAILED,
  SEND_MSG_FAILED,
  FETCH_MSG_THREADS_FAILED,
  FETCH_MSG_THREADS,
  FETCH_USER_THREADS,
  FETCH_USER_THREADS_SUCCESS,
  FETCH_USER_THREADS_FAIL,
  THREAD_CREATION_FAILED,
} from './types'
import firebase from 'react-native-firebase'
import moment from 'moment'
var _ = require('lodash')
const uuidv1 = require('uuid/v1');


export const fetchMessageThreads = (role, thread) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection(role).doc(user.uid)
    .collection('message_threads').get().then((querySnap) => {
      if (querySnap.empty) {
        const msgInfo = { empty: true, threads: [] }
        return dispatch({ type: FETCH_MSG_THREADS, payload: msgInfo })
      }

      let msgs = []
      querySnap.forEach(doc => {
        msgs.push(doc.data())
        const msgInfo = { empty: false, threads: msgs }
        dispatch({ type: FETCH_MSG_THREADS, payload: msgInfo })
      })
    }).catch((err) => {
      dispatch({ type: FETCH_MSG_THREADS_FAILED })
    })
  }
}

export const fetchMessages = (mentor, self) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users').doc(user.uid)
    .collection('mentors').doc(mentor.id)
    .collection('messages').orderBy('timeSent').onSnapshot((querySnap) => {
      if (querySnap.empty) {
        createNewThread(mentor, self, dispatch)
        return dispatch({ type: FETCH_MSGS, payload: [] })
      }

      let msgs = []
      querySnap.forEach(doc => {

        msgs.push(doc.data())
      })
      console.log('unsorted', msgs)
      msgs = sortMessages(msgs)
      dispatch({ type: FETCH_MSGS, payload: msgs })
    }, (err) => dispatch({ type: FETCH_MSGS_FAILED, payload: err }))
  }
}


export const fetchUserMessages = (threadId) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches').doc(user.uid)
    .collection('users').doc(threadId)
    .collection('messages').orderBy('timeSent').onSnapshot((querySnap) => {
      if (querySnap.empty) {
        return dispatch({ type: FETCH_MSGS, payload: [] })
      }

      let msgs = []
      querySnap.forEach(doc => {
        msgs.push(doc.data())
      })

      msgs = sortMessages(msgs)
      dispatch({ type: FETCH_MSGS, payload: msgs })
    }, (err) => dispatch({ type: FETCH_MSGS_FAILED, payload: err }))
  }
}

export const unsubscribeMessages = (thread) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users').doc(user.uid)
    .collection('message_threads').doc(thread)
    .collection('messages').onSnapshot(() => {})
  }
}

export const unsubscribeUserMessages = (thread) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches').doc(user.uid)
    .collection('users').doc(thread)
    .collection('messages').onSnapshot(() => {})
  }
}


const createNewThread = (mentor, self, dispatch) => {
  const threadId = mentor.id
  const user = firebase.auth().currentUser

  //for user the thread id is the mentor's user uid
  const userThread = firebase.firestore().collection('users')
  .doc(user.uid).collection('mentors')
  .doc(threadId).set({
    mentor,
    user: self,
    thread: threadId,
  })

  //for the mentor the thread id is the mentee's user uid
  const mentorThread = firebase.firestore().collection('coaches')
  .doc(mentor.id).collection('users')
  .doc(user.uid).set({
    mentor,
    user: self,
    thread: user.uid,
  })

  Promise.all([userThread, mentorThread]).catch((err) => {
    dispatch({ type: THREAD_CREATION_FAILED, payload: err })
  })
}

export const sendMessageToCoach = (thread, text, user, mentor) => {
  const { userId } = user
  let _message = MessageMentor(text, user, mentor)

  return (dispatch) => {
    if (text === "") {
      return;
    }

    //for personal account
    let userMsg = firebase.firestore().collection('users').doc(userId)
    .collection('mentors').doc(thread)
    .collection('messages').add(_message)
    //for reciever thread
    let mentorMsg = firebase.firestore().collection('coaches').doc(mentor.id)
    .collection('users').doc(userId)
    .collection('messages').add(_message)

    Promise.all([userMsg, mentorMsg]).then(() => {
      dispatch({ type: SEND_MSG, payload: _message })
    }).catch((err) => {
      dispatch({ type: SEND_MSG_FAILED, payload: err })
    })
  }
}

export const sendMessageToUser = (text, mentee, mentor) => {
  return (dispatch) => {
    let _message = MessageUser(text, mentee, mentor)
    let db = firebase.firestore()
    let mentorId = mentor.id
    let menteeId = mentee.userId 

    //for personal account
    let mentorMsg = db.collection('coaches').doc(mentorId)
    .collection('users').doc(menteeId).collection('messages').add(_message)

    // for recipient (mentee)
    let menteeMsg = db.collection('users').doc(menteeId)
    .collection('mentors').doc(mentorId).collection('messages').add(_message)

    Promise.all([mentorMsg, menteeMsg]).then(() => {
      dispatch({ type: SEND_MSG, payload: _message })
    }).catch((err) => {
      dispatch({ type: SEND_MSG_FAILED, payload: err })
    })
  }
}

export const alertUserEmail = () => {
  return (dispatch) => {
    switch (eventType) {
      case 'welcome':
        break;
      case 'lesson_booked':
        break;
      case 'backgroundCheckReturned':
        break;
      default:
    }
  }
}

export const fetchMentors = () => {
  return (dispatch) => {
    const user = firebase.auth()
    firebase.firestore().collection('users').doc(user.uid)
    .collection('mentors').get().then((querySnap) => {
      if (querySnap.empty) {
        mentorInfo = { mentors: [], mentorsEmpty: true }
        return dispatch({ type: FETCH_MENTOR_THREAD, payload: mentorInfo })
      }

      let mentors = []
      querySnap.forEach((doc) => {
        mentors.push(doc.data())
        mentorInfo = { mentors: mentors, mentorsEmpty: false }
        dispatch({ tpye: FETCH_MENTOR_THREAD, payload: mentors })
      })
    }).catch((err) => dispatch({ type: FETCH_MENTOR_THREAD_FAILED, payload: err }))
  }
}

export const onMessageMentor = (coach, coachId) => {
  return (dispatch) => {
    const user = firebase.auth().currentUser
    let userRef = firebase.firestore().collection('users').doc(user.uid)

    userRef.collection('mentors')
    .where("coachId", "==", coachId)
    .get().then((querySnap) => {
      if (querySnap.empty) {
        return addMenor(coachId)
      }

      let mentors = []
      querySnap.forEach(doc => {
        let id = doc.data()
        userRef.collection('mentors').doc(id)
        .get().then((doc) => {
          var mentor = doc.data()
          dispatch({ type: FETCH_MENTOR_THREAD, payload: mentors })
        })
      })
    })
  }
}

export const fetchUserThreads = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_THREADS })
    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches').doc(user.uid)
    .collection('users').get().then((querySnap) => {
      if (querySnap.empty) {
        dispatch({ type: FETCH_USER_THREADS_SUCCESS, payload: [] })
      }

      let users = []
      querySnap.forEach((doc) => {
        let thread = doc.data()
        thread.id = doc.id
        users.push(thread)

        dispatch({ type: FETCH_USER_THREADS_SUCCESS, payload: users })
      })
    }).catch((err) => {
      dispatch({ type: FETCH_USER_THREADS_FAIL, payload: err })
    })
  }
}

const MessageMentor = (text, mentee, mentor) => {
  let id = uuidv1()
  msg = {
    id: id,
    text: text.text,
    timeSent: moment().format(),
    from: mentee.userId,
    nameOfSender: mentee.name,
    to: mentor.name
  }

  return msg
}

const MessageUser = (text, mentee, mentor) => {
  let id = uuidv1()
  msg = {
    id: id,
    text: text.text,
    timeSent: moment().format(),
    from: mentor.id,
    nameOfSender: mentor.name,
    to: mentee.userId
  }

  return msg
}

const sortMessages = (messages) => {
  let sortedMsgs = []
  let days = []
  _.forEach(messages, (msg) => {
    let tstmp = msg.timeSent
    let today = moment().format('MMM Do')
    let time = moment(tstmp).format('MMM Do')

    if (today === time) {
      msg.isToday = true
      msg.isNew = _.includes(days, time)? false:true
    } else if (_.includes(days, time)) {
      msg.isNew = false
    } else {
      msg.isNew = true
    }
    days.push(time)
    sortedMsgs.push(msg)
  })
  return sortedMsgs
}
