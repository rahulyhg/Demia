import {
  BOOK_COACH,
  BOOKING_SUCCESS,
  BOOKING_FAIL,
  COACH_FAIL,
  COACH_SUCCESS,
  PAYMENT_REQUEST,
  SCHEDULE_FAILED,
  SCHEDULE_SUCCESS,
  ATTEMPT_SCHEDULE,
  BOOKING,
  TOKEN_RETURNED,
  RATING_FAILED,
  RATING_SUCCESS,
  RATING,
  CREDITS_SUCCESS,
  CREDITS_FAIL,
  FETCH_SEARCH_TERMS_SUCCESS,
  FETCH_SEARCH_TERMS_FAILURE,
  SEARCH_MENTORS_FAILED,
  SEARCH_MENTORS
} from '../actions/types';

const INITIAL_STATE = {
  error: '',
  loading: false,
  message: '',
  booked: false,
  empty: false,
  searchTerms: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOK_COACH:
      return { ...state, loading: true }
    case BOOKING_SUCCESS:
      return { ...state, loading: false, booked: true }
    case BOOKING_FAIL:
      return { ...state, loading: false, error: 'Booking Failed, please contact support'}
    case COACH_FAIL:
      return { ...state, loading: false, error: 'Failed to alert coach of practice' }
    case COACH_SUCCESS:
      return { ...state, loading: false }
    case PAYMENT_REQUEST:
      return { ...state, loading: true }
    case ATTEMPT_SCHEDULE:
      return { ...state, loading: true }
    case SCHEDULE_FAILED:
      return { ...state, loading: false }
    case SCHEDULE_SUCCESS:
      return { ...state, loading: false, booked: true, }
    case BOOKING:
      return { ...state, loading: true }
    case TOKEN_RETURNED:
      return { ...state, loading: false }
    case RATING:
      return { ...state, loading: true }
    case RATING_SUCCESS:
      return { ...state, loading: false, message: action.payload }
    case RATING_FAILED:
      return { ...state, loading: false, message: action.payload }
    case CREDITS_SUCCESS:
      return { ...state, loading: false, message: action.payload }
    case CREDITS_FAIL:
      return { ...state, loading: false, message: 'Payment Failed...' }
    case FETCH_SEARCH_TERMS_SUCCESS:
      return { ...state, searchInfo: action.payload }
    case FETCH_SEARCH_TERMS_FAILURE:
      return { ...state, }
    case SEARCH_MENTORS_FAILED:
      return { ...state, }
    case SEARCH_MENTORS:
      return { ...state, }
    default:
      return state;
  }
}
