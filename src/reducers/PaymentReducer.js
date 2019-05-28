import {
  CARD_RETRIEVAL,
  RETRIEVAL_FAIL,
  RETRIEVAL_SUCCESS,
  ADD_METHOD_FAIL,
  ADD_METHOD_SUCCESS,
  CREDITS_SUCCESS,
  CREDITS_FAIL,
  PAYMENT_REQUEST,
  SUBSCRIPTION_FAILED,
  SUBSCRIPTION_SUCCESS,
  SUSPEND_SUBSCRIPTION,
  SUSPEND_SUBSCRIPTION_FAIL,
  FETCH_PAYMENT_HISTORY,
  FETCH_PAYMENT_H_FAILED,
  FETCH_PAYMENT_H_SUCCESS,
  STRIPE_TOK_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
  error: '',
  loading: false,
  message: '',
  messages: [],
  cardError: '',
  cardMsg: '',
  card: {},
  user: {},
  noCard: {
    last4: '1234',
    cardType: 'Update Card',
  },
  invoiceData: {
    empty: true,
    invoices: [],
  },
  fetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CARD_RETRIEVAL:
      return { ...state, fetching: true }
    case RETRIEVAL_SUCCESS:
      return { ...state, card: action.payload, fetching: false, }
    case RETRIEVAL_FAIL:
      return { ...state, cardError: action.payload, card: state.noCard, fetching: false }
    case ADD_METHOD_FAIL:
      return { ...state, }
    case ADD_METHOD_SUCCESS:
      return { ...state, cardMsg: 'Card successfully added!'}
    case CREDITS_SUCCESS:
      return { ...state, message: action.payload}
    case CREDITS_FAIL:
      return { ...state, }
    case PAYMENT_REQUEST:
      return { ...state, }
    case SUBSCRIPTION_FAILED:
      return { ...state, messages: action.payload }
    case SUBSCRIPTION_SUCCESS:
      return { ...state, messages: action.payload }
    case SUSPEND_SUBSCRIPTION:
      return { ...state, messages: action.payload }
    case SUSPEND_SUBSCRIPTION_FAIL:
      return { ...state, messages: action.payload }
    case FETCH_PAYMENT_HISTORY:
      return { ...state, loading: true }
    case FETCH_PAYMENT_H_FAILED:
      return { ...state, loading: false }
    case FETCH_PAYMENT_H_SUCCESS:
      return { ...state, loading: false, invoiceData: action.payload }
    case STRIPE_TOK_FAILED:
      return { ...state, loading: false, messages: action.payload }
    default:
      return { ...state }
  }
}
