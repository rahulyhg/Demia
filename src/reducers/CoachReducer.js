import {
  FETCH_COACHES,
  FETCH_COACHES_SUCCESS,
  QUERY_COACHES,
  QUERY_COACHES_SUCCESS,
  QUERY_COACHES_FAIL,
  EMPTY_QUERY,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILED,
  SCHOOLS_QUERIED,
  SCHOOLS_FAILED,
  DOC_SAVE,
  DOC_SAVE_SUCCESS,
  DOC_SAVE_FAILURE,
  SUBMIT_PERSONAL_INFO,
  SUBMIT_PERSONAL_INFO_SUCCESS,
  SUBMIT_PERSONAL_INFO_FAILURE,
  FETCH_LESSON_HISTORY_SUCCESS,
  FETCH_LESSON_HISTORY_FAILURE,
  PAYOUT,
  PAYOUT_SUCCESS,
  PAYOUT_FAILURE,
  FETCH_DOC,
  FETCH_DOC_FAILED,
  FETCH_METHOD_SUCCESS,
  FETCH_METHOD_FAILED,
  CHANGE_METHOD_FAILED,
  CHANGE_METHOD_SUCCESS,
  FETCH_EXTERNAL_CARD_SUCCESS,
  FETCH_EXTERNAL_CARD_FAILED,
  FETCH_EXTERNAL_BANK_SUCCESS,
  FETCH_EXTERNAL_BANK_FAILED,
  DOC_SUBMITTED,
  DOC_SUBMITTED_FAILED,
  FETCH_AVAILABILITY,
  FETCH_AVAILABILITY_FAILED,
  FETCH_THREADS,
  FETCH_THREADS_FAILED,
  FETCH_THREADS_SUCCESS,
  ADD_CLASS,
  ADD_CLASS_FAIL,
  FETCH_CLASSES,
  FETCH_CLASSES_FAIL,
  REMOVE_CLASS,
  REMOVE_CLASS_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  error: '',
  loading: false,
  coaches: [],
  refreshing: false,
  empty: false,
  reviews: [],
  schools: [],
  practicesInfo: {
    practices: [],
    empty: false,
  },
  docs: [],
  defaultMethod: '',
  message: '',
  externalCard: {
    brand: '',
    last4: '',
    payout_methods: [],
  },
  externalBank: {
    bankName: '',
    last4: '',
  },
  docSubmitted: false,
  docSubmittedFailed: false,
  availability: [{}],
  threadLoading: false,
  mentorThreads: [],
  classes: [],
  fetchClassesErr: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COACHES:
      return { ...state, loading: true, error: '' }
    case FETCH_COACHES_SUCCESS:
      return { ...state, loading: false, coaches: action.payload};
    case QUERY_COACHES:
      return { ...state, loading: false, refreshing: true, }
    case QUERY_COACHES_FAIL:
      return { ...state, loading: false, refreshing: false, empty: true}
    case QUERY_COACHES_SUCCESS:
      return { loading: false, coaches: action.payload.coaches, empty: false}
    case EMPTY_QUERY:
      return { ...state, loading: false, empty: true }
    case FETCH_REVIEWS_FAILED:
      return { ...state, loading: false, reviews: action.payload }
    case FETCH_REVIEWS_SUCCESS:
      return { ...state, loading: false, reviews: action.payload }
    case SCHOOLS_QUERIED:
      return { ...state, schools: action.payload }
    case SCHOOLS_FAILED:
      return { ...state, schools: [], error: action.payload }
    case DOC_SAVE:
      return { ...state, }
    case DOC_SAVE_FAILURE:
      return { ...state, }
    case DOC_SAVE_FAILURE:
      return { ...state, }
    case SUBMIT_PERSONAL_INFO:
      return { ...state, }
    case SUBMIT_PERSONAL_INFO_SUCCESS:
      return { ...state, }
    case SUBMIT_PERSONAL_INFO_FAILURE:
      return { ...state, }
    case FETCH_LESSON_HISTORY_SUCCESS:
      return { ...state, practicesInfo: action.payload, loading: false }
    case FETCH_LESSON_HISTORY_FAILURE:
      return { ...state, empty: true }
    case PAYOUT_SUCCESS:
      return { ...state, loading: false, }
    case PAYOUT_FAILURE:
      return { ...state, loading: false, }
    case FETCH_DOC:
      return { ...state, docs: action.payload }
    case FETCH_DOC_FAILED:
      return { ...state, docs: [] }
    case FETCH_METHOD_SUCCESS:
      return { ...state, defaultMethod: action.payload }
    case FETCH_METHOD_FAILED:
      return { ...state, error: 'Error retrieving default payment method. If this error continues please contact support.'}
    case CHANGE_METHOD_SUCCESS:
      return { ...state, message: 'Default method successfully changed.'}
    case CHANGE_METHOD_FAILED:
      return { ...state, error: 'Error changing payment method. If this error continues please contact support.'}
    case FETCH_EXTERNAL_CARD_SUCCESS:
      return { ...state, externalCard: action.payload }
    case FETCH_EXTERNAL_BANK_SUCCESS:
      return { ...state, externalBank: action.payload }
    case DOC_SUBMITTED:
      return { ...state, docSubmitted: true }
    case DOC_SUBMITTED_FAILED:
      return { ...state, docSubmittedFailed: true }
    case FETCH_AVAILABILITY:
      return { ...state, availability: action.payload }
    case FETCH_AVAILABILITY_FAILED:
      return { ...state, }
    case FETCH_THREADS_FAILED:
      return { ...state, threadLoading: false, threadError: action.payload }
    case FETCH_THREADS_SUCCESS:
      return { ...state, threadLoading: false, mentorThreads: action.payload }
    case ADD_CLASS:
      return { ...state, }
    case ADD_CLASS_FAIL:
      return { ...state, }
    case FETCH_CLASSES:
      return { ...state, classes: action.payload }
    case FETCH_CLASSES_FAIL:
      return { ...state, fetchClassesErr: action.payload }
    default:
      return state;
  }
};
