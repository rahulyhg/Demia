import {
  FETCHING,
  FETCH_SUCCESS,
  FETCH_FAILED,
  EMPTY,
  REQUEST_RESCHEDULE,
  R_R_FAILED,
  R_R_SUCCESS,
  RESCHEDULE_FAILED,
  RESCHEDULE_SUCCESS,
  FETCH_LESSONS_TO_RATE,
  FETCH_LESSONS_TO_RATE_SUCCESS,
  FETCH_LESSONS_TO_RATE_FAILURE,
  FETCH_LESSONS,
  FETCH_LESSONS_SUCCESS,
  FETCH_LESSONS_FAILURE,
} from '../actions/types';
const failError = "Could not make booking request. Please try again.";
const INITIAL_STATE = {
  error: '',
  loading: false,
  _message: '',
  booked: false,
  empty: false,
  success: false,
  schedule: {},
  practicesInfo: {
    practices: [],
    empty: false,
  },
  lessonsInfo: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING:
      return { ...state, loading: true }
    case FETCH_SUCCESS:
      return { ...state, loading: false }
    case FETCH_FAILED:
      return { ...state, loading: false}
    case EMPTY:
      return { ...state, empty: true }
    case REQUEST_RESCHEDULE:
      return { ...state, loading: true }
    case R_R_FAILED:
      return { ...state, loading: false, error: 'Request Failed' }
    case R_R_SUCCESS:
      return { ...state, loading: false, success: true }
    case RESCHEDULE_SUCCESS:
      return { ...state, _message: 'Reschedule Successfull!'}
    case RESCHEDULE_FAILED:
      return { ...state, _message: 'Unsuccessfull reschedule, please try again'}
    case FETCH_LESSONS_SUCCESS:
      return { ...state, loading: false, practicesInfo: action.payload }
    case FETCH_LESSONS_FAILURE:
      return { ...state, loading: false, _message: 'Error fetching lessons, please try again.'}
    case FETCH_LESSONS:
      return { ...state, loading: true }
    case FETCH_LESSONS_TO_RATE:
      return { ...state, loading: true }
    case FETCH_LESSONS_TO_RATE:
      return {...state, loading: true }
    case FETCH_LESSONS_TO_RATE_SUCCESS:
      return { ...state, loading: false, lessonsInfo: action.payload }
    case FETCH_LESSONS_TO_RATE_FAILURE:
      return { ...state, loading: false }
    default:
      return state;
  }
}
