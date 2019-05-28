import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CoachReducer from './CoachReducer';
import BookingReducer from './BookingReducer';
import ProfileReducer from './ProfileReducer';
import ScheduleReducer from './ScheduleReducer';
import PaymentReducer from './PaymentReducer';
import MessageReducer from './MessageReducer';
import SearchReducer from './SearchReducer';

export default combineReducers({
  auth: AuthReducer,
  coach: CoachReducer,
  booking: BookingReducer,
  profile: ProfileReducer,
  schedule: ScheduleReducer,
  payment: PaymentReducer,
  message: MessageReducer,
  search: SearchReducer,
});
