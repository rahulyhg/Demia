import {
  NAME_CHANGED,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_CHNAGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILED,
  LOGIN_USER,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  CHECK_NETWORK,
 } from '../actions/types';
import { Actions } from 'react-native-router-flux';

const INITAL_STATE = {
  name: '',
  email: '',
  password: '',
  confirmation: '',
  user: null,
  error: '',
  loading: false,
  numOfLessons: 0,
  price: '',
  coach: {},
  lesson: {},
  isConnected: false
}

export default (state = INITAL_STATE, action) => {

  switch (action.type) {
    case NAME_CHANGED:
      return { ...state, name: action.payload };
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case CONFIRM_CHNAGED:
      return { ...state, confirmation: action.payload };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' }
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITAL_STATE, user: action.payload, };
    case LOGIN_USER_FAILED:
      return { ...state, error: action.payload, password: '', loading: false }
    case SIGNUP_USER:
      return { ...state, loading: true, error: '', user: actions.payload }
    case SIGNUP_USER_SUCCESS:
      return { ...state, ...INITAL_STATE, user: action.payload, };
    case SIGNUP_USER_FAIL:
      return { ...state, error: action.payload, password: '', loading: false }
    case LOGOUT_USER:
      return { ...state, loading: true }
    case LOGOUT_USER_SUCCESS:
      return { ...state, loading: false }
    case LOGOUT_USER_FAIL:
      return { ...state, error: 'Something went wrong...', loading: false }
    case CHECK_NETWORK:
      return { ...state, isConnected: action.payload }
    default:
      return state;
  }
};
