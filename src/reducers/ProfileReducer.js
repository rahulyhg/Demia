 import {
  UPDATE_SUCCESS,
  SAVE_PROFILE,
  FETCH_PROFILE,
  EMAIL_FAIL,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAIL,
  PASSWORD_FAIL,
  RETRIEVAL_FAIL,
  RETRIEVAL_SUCCESS,
  CREDITS_FAIL,
  CREDITS_SUCCESS,
  FETCH_SUBSCRIPTION,
  FETCH_SUBSCRIPTION_FAILED,
  FETCH_SUBMITTED_DOCS_SUCCESS,
  FETCH_SUBMITTED_DOCS_FAILED,
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
} from '../actions/types';

const failError = "Could not make booking request. Please try again.";
const INITIAL_STATE = {
  error: '',
  loading: false,
  message: '',
  card: {
    cardType: '',
    last4: '1234',
  },
  user: {
    subject: []
  },
  availibility: [],
  subscription: {},
  submittedDocs: {
    tosAccepted: false,
    idSubmitted: false,
    personalInfoSubmitted: false,
  },
  schoolInfo: {
    schools: [],
    empty: false,
  },
  preps: [],
  currentPrep: {},
  newPrep: {},
  emptyPreps: false,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_PROFILE:
      return { ...state, user: action.payload }
    case SAVE_PROFILE:
      return { ...state, loading: true }
    case UPDATE_SUCCESS:
      return { ...state, message: 'Update Successful' }
    case EMAIL_FAIL:
      return { ...state, error: 'Email was not able to update' }
    case SAVE_PROFILE_SUCCESS:
      return { ...state, message: action.payload }
    case SAVE_PROFILE_FAIL:
      return { ...state, message: 'Attempt Fail' }
    case PASSWORD_FAIL:
      return { ...state, message: 'Attempt Failed' }
    case RETRIEVAL_FAIL:
      return { ...state, }
    case RETRIEVAL_SUCCESS:
      return { ...state, card: action.payload }
    case FETCH_SUBSCRIPTION:
      return { ...state, subscription: action.payload }
    case FETCH_SUBSCRIPTION_FAILED:
      return { ...state }
    case CREDITS_FAIL:
      return { ...state, error: 'Something went wrong with your payment.'}
    case CREDITS_SUCCESS:
      return { ...state, message: 'Lesson Credits were added to your account.'}
    case FETCH_SUBMITTED_DOCS_SUCCESS:
      return { ...state, submittedDocs: action.payload }
    case FETCH_SUBMITTED_DOCS_FAILED:
      return { ...state, }
    case QUERY_SCHOOLS:
      return { ...state, schoolInfo: action.payload }
    case QUERY_SCHOOLS_FAILED:
      return { ...state, error: 'Error fetching School'}
    case FETCH_ACTIVE_PREPS:
      return { ...state, preps: action.payload.preps, emptyPreps: action.payload.empty }
    case FETCH_ACTIVE_PREPS_FAILED:
      return { ...state, }
    case SWITCH_PREP:
      return { ...state, currentPrep: action.payload }
    case SWITCH_PREP_FAILED:
      return { ...sate, }
    case ADD_NEW_PREP:
      return { ...state, currentPrep: action.payload }
    case ADD_NEW_PREP_FAILED:
      return { ...state }
    case  REPORT_USER_FAIL:
      return { ...state }
    case  REPORT_USER_SUCCESS:
      return { ...state, }
    default:
      return state;
  }
}
