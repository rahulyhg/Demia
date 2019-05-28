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
  FETCH_MENTOR_THREADS,
  FETCH_MENTOR_THREADS_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
  empty: false,
  messages: [],
  userThreads: [],
  userthreadErr: {},
  mentorThreads: [],
  mentorThreadErr: {},
  loadingThreads: false,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_MSGS:
      return { ...state, messages: action.payload }
    case SEND_MSG:
      return { ...state, }
    case FETCH_MSGS_FAILED:
      return { ...state, }
    case SEND_MSG_FAILED:
      return { ...state, }
    case FETCH_MSG_THREADS_FAILED:
      return { ...state, }
    case FETCH_MSG_THREADS:
      return { ...state, }
    case FETCH_USER_THREADS:
      return { ...state, loadingThreads: true }
    case FETCH_USER_THREADS_SUCCESS:
      return { ...state, userThreads: action.payload, lodingThreads: false }
    case FETCH_USER_THREADS_FAIL:
      return { ...state, userthreadErr: action.payload, lodingThreads: false }
    case FETCH_MENTOR_THREADS:
      return { ...state, mentorThreads: action.payload }
    case FETCH_MENTOR_THREADS_FAIL:
      return { ...state, mentorThreadErr: action.payload }
    default:
      return { ...state }
  }
}
