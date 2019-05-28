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
} from './types'
import firebase from 'react-native-firebase'
import moment from 'moment'
var _ = require('lodash')

export const fetchMessageThreads = (role, thread) => {
  return (dispatch) => {
    try {
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
      })
    } catch(err) {
      console.log('error', err)
      dispatch({ type: FETCH_MSG_THREADS_FAILED })
    }
  }
}

export const fetchMessages = (mentor, self) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('users').doc(user.uid)
      .collection('mentors').doc(mentor.id)
      .collection('messages').orderBy('timestamp').onSnapshot((querySnap) => {
        if (querySnap.empty) {
          createNewThread(mentor, self, dispatch)
          return dispatch({ type: FETCH_MSGS, payload: [] })
        }

        let msgs = []
        querySnap.forEach(doc => {
          msgs.push(doc.data())
        })

        msgs = sortedMsgs(msgs)
        dispatch({ type: FETCH_MSGS, payload: msgs })
      }, (err) => dispatch({ type: FETCH_MSGS_FAILED, payload: err }))
    } catch(err) {
      dispatch({ type: FETCH_MSGS_FAILED, payload: err })
    }
  }
}


export const fetchUserMessages = (threadId) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
      .collection('users').doc(threadId)
      .collection('messages').orderBy('timestamp').onSnapshot((querySnap) => {
        if (querySnap.empty) {
          return dispatch({ type: FETCH_MSGS, payload: [] })
        }

        let msgs = []
        querySnap.forEach(doc => {
          msgs.push(doc.data())
        })

        msgs = sortedMsgs(msgs)
        dispatch({ type: FETCH_MSGS, payload: msgs })
      }, (err) => dispatch({ type: FETCH_MSGS_FAILED, payload: err }))
    } catch(err) {
      dispatch({ type: FETCH_MSGS_FAILED, payload: err })
    }
  }
}

export const unsubscribeMessages = (thread) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('users').doc(user.uid)
      .collection('message_threads').doc(thread)
      .collection('messages').onSnapshot(() => {})
    } catch(err) {
      console.log('err unscubscribing', err)
    }
  }
}

export const unsubscribeUserMessages = (thread) => {
  return (dispatch) => {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
      .collection('users').doc(thread)
      .collection('messages').onSnapshot(() => {})
    } catch(err) {
      console.log('err unscubscribing', err)
    }
  }
}


const createNewThread = (mentor, self, dispatch) => {
  try {
    console.log('create new thread')
    const threadId = mentor.id
    const user = firebase.auth().currentUser
    firebase.firestore().collection('users')
    .doc(user.uid).collection('mentors')
    .doc(threadId).set({
      mentor,
      user: self,
      thread: threadId,
    }).catch((err) => {
      console.log(err)
    })

    firebase.firestore().collection('coaches')
    .doc(mentor.id).collection('users')
    .doc(user.uid).set({
      mentor,
      user: self,
      thread: user.uid,
    }).catch((err) => {
      console.log(err)
    })
  } catch(err) {
    console.log(err, 'err')
  }
}

export const sendMessageToCoach = (thread, text, user, mentor) => {
  const { name, userId } = user
  let _message = Message(text, user, mentor)
  console.log(mentor)
  return (dispatch) => {
    if (text === "") {
      return;
    }

    try {
      const _user = firebase.auth().currentUser
      firebase.firestore().collection('users').doc(userId)
      .collection('mentors').doc(thread)
      .collection('messages').add(_message).then(() => {
        dispatch({ type: SEND_MSG })
      }).catch((err) => {
        console.log('SEND_MSG_FAILED', err)
        dispatch({ type: SEND_MSG_FAILED })
      })

      //for reciever thread
      firebase.firestore().collection('coaches').doc(mentor.id)
      .collection('users').doc(userId)
      .collection('messages').add(_message).then(() => {
        dispatch({ type: SEND_MSG })
      }).catch((err) => {
        console.log('SEND_MSG_FAILED', err)
        dispatch({ type: SEND_MSG_FAILED })
      })
    } catch(err) {
      console.log('SEND_MSG_FAILED', err)
      dispatch({ type: SEND_MSG_FAILED })
    }
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
    try {
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
      })
    } catch(err) {
      dispatch({ type: FETCH_MENTOR_THREAD_FAILED })
    }
  }
}

export const onMessageMentor = (coach, coachId) => {
  return (dispatch) => {
    try {
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
            dispatch({  })
          })

        })
      })
    } catch(err) {

    }
  }
}

export const fetchUserThreads = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_THREADS })
    try {
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
      })
    } catch(err) {
      dispatch({ type: FETCH_USER_THREADS_FAIL, payload: err })
    }
  }
}

const Message = (text, user, mentor) => {
  let id = Math.floor(Math.random() * 10000000000)
  console.log('text', text)
  msg = {
    id: id,
    text: text.text,
    timestamp: new Date(),
    user: user.userId,
    name: user.name,
    to: mentor.name
  }

  return msg
}

const Message1 = (text, user, mentor) => {
  let id = Math.floor(Math.random() * 10000000000)
  msg = {
    id: id,
    text: text.text,
    timestamp: new Date(),
    user: mentor.id,
    name: mentor.name,
    to: user.name
  }

  return msg
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

const sortedMsgs = (messages) => {
  let sortedMsgs = []
  let days = []
  _.forEach(messages, (msg) => {
    let today = moment().format('MMM Do')
    let time = moment(msg.timestamp).format('MMM Do')

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
