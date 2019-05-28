import React, { Component } from 'react';
import { Router, Scene, Actions, Stack } from 'react-native-router-flux';
import { Text, View, Image } from 'react-native';
import Signup from './components/onboard/Signup';
import CreateLesson from './components/booking/CreateLesson';
import Welcome from './components/onboard/Welcome';
import CoachProfile from './components/booking/CoachProfile';
import FindCoaches from './components/booking/FindCoaches';
import Schedule from './components/schedule/Schedule';
import BookingSignup from './components/booking/BookingSignup';
import ManageProfile from './components/profile/ManageProfile';
import RequestCity from './components/booking/RequestCity';
import AddPractice from './components/schedule/AddPractice';
import ContactCoach from './components/contact/ContactCoach';
import CoachLocker from './components/mentor/CoachLocker';
import Athletes from './components/profile/Athletes';
import PastPractices from './components/profile/PastPractices';
import PaymentOptions from './components/profile/PaymentOptions';
import LessonCredits from './components/profile/LessonCredits';
import ChangePassword from './components/profile/ChangePassword';
import CoachManagement from './components/profile/CoachManagement';
import ContactParent from './components/contact/ContactParent';
import PastCoachings from './components/profile/PastCoachings';
import LockerRoom from './components/mentor/LockerRoom';
import AddPayment from './components/profile/AddPayment';
import Availibility from './components/profile/Availibility';
import CoachSchedule from './components/schedule/CoachSchedule';
import UnscheduledPractices from './components/schedule/UnscheduledPractices';
import Payout from './components/profile/Payout';
import BanksAndCards from './components/profile/BanksAndCards';
import MenteeLocker from './components/profile/MenteeLocker';
import PersonalInfo from './components/profile/PersonalInfo';
import MenteeRoom from './components/profile/MenteeRoom';
import Support from './components/profile/Support';
import Legal from './components/profile/Legal';
import RequiredDocuments from './components/profile/RequiredDocuments';
import TakePic from './components/profile/TakePic';
import TermsOS from './components/profile/TermsOS';
import MentorInfo from './components/profile/MentorInfo';
import ProfileInfo from './components/profile/ProfileInfo';
import UserManagement from './components/profile/ManageUsers';
import MessageThread from './components/contact/MessageThread';
import RelevantClasses from './components/profile/RelevantClasses';
import MentorMessageThread from './components/contact/MentorMessageThread';


import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters'

class RouterComponent extends Component {
  render() {
    const tabIcons = ({ focused, title }) => {
      let image;
      switch(title) {
        case 'Book':
          image = !focused ? require('../assets/icons/grey_book_tab.png') : require('../assets/icons/book_tab.png')
          break;
        case 'Lessons':
          image = !focused ? require('../assets/icons/greySchedule.png') : require('../assets/icons/lessons_tab.png')
          break;
        case 'Contact':
          image = !focused ? require('../assets/icons/greyContact.png') : require('../assets/icons/mentors_tab.png')
          break;
        case 'Mentors':
          image = !focused ? require('../assets/icons/greyContact.png') : require('../assets/icons/mentors_tab.png')
          break;
        case 'Profile':
          image = !focused ? require('../assets/icons/profile.png') : require('../assets/icons/profile_tab.png')
          break;
        case 'Locker':
          image = !focused ? require('../assets/icons/grey_locker_tab.png') : require('../assets/icons/locker_tab.png')
          break;
      }

      return ( <Image source={image} style={styles.image}/> )
    }

    return (
      <Router>
        <Stack key="root" hideNavBar initial>

          <Scene key="welcome" component={Welcome} hideNavBar />

          <Scene key="userTabs" tabs showLabel={true} activeTintColor={'dimgrey'} tabBarStyle={styles.tabs} >
            <Scene key="book" title="Book" icon={tabIcons} >
              <Scene key="createLesson" component={CreateLesson} hideNavBar/>
              <Scene key="requestCity" component={RequestCity} hideNavBar />
              <Scene key="findCoaches" component={FindCoaches} hideNavBar />
              <Scene key="profile" component={CoachProfile} hideNavBar />
              <Scene key="bookingSignup" component={BookingSignup} hideNavBar/>
            </Scene>

            <Scene key="schedule" title="Lessons" icon={tabIcons}>
              <Scene key="schedule" component={Schedule} hideNavBar/>
              <Scene key="addPractice" component={AddPractice} hideNavBar />
            </Scene>

            <Scene key="Contact" title="Mentors" icon={tabIcons} >
              <Scene key="contactCoach" component={ContactCoach} hideNavBar />
              <Scene key="profile" component={CoachProfile} hideNavBar />
              <Scene key="bookingSignup" component={BookingSignup} hideNavBar/>
              <Scene key="messageThread" component={MessageThread} hideNavBar/>
            </Scene>

            <Scene key="manageProfile" title="Profile" icon={tabIcons} >
              <Scene key="manageProfile" component={ManageProfile} hideNavBar />
              <Scene key="athletes" component={Athletes} hideNavBar />
              <Scene key="pastPractices" component={PastPractices} hideNavBar />
              <Scene key="paymentOptions" component={PaymentOptions} hideNavBar />
              <Scene key="lessonCredits" component={LessonCredits} hideNavBar />
              <Scene key="changePassword" component={ChangePassword} hideNavBar />
              <Scene key="menteeLocker" component={MenteeLocker} hideNavBar />
              <Scene key="menteeRoom" component={MenteeRoom} hideNavBar />
              <Scene key="support" component={Support} hideNavBar />
              <Scene key="legal" component={Legal} hideNavBar />
              <Scene key="profileInfo" component={ProfileInfo} hideNavBar />
              <Scene key="manageUsers" component={UserManagement} hideNavBar />
            </Scene>
          </Scene>

          <Scene key="coachTabs" tabs showLabel={true} activeTintColor={'#171717'} tabBarStyle={styles.tabs}>
            <Scene key="locker" title="Locker" icon={tabIcons} >
              <Scene key="coachLocker" component={CoachLocker} hideNavBar />
              <Scene key="lockerRoom" component={LockerRoom} hideNavBar />
            </Scene>

            <Scene key="schedule" title="Lessons" icon={tabIcons}>
              <Scene key="schedule" component={CoachSchedule} hideNavBar />
              <Scene key="unscheduledPractices" component={UnscheduledPractices} hideNavBar />
            </Scene>

            <Scene key="Contact" title="Contact" icon={tabIcons}>
              <Scene key="contactParent" component={ContactParent} hideNavBar/>
              <Scene key="mentorMessageThread" component={MentorMessageThread} hideNavBar/>
            </Scene>

            <Scene key="manageProfile" title="Profile" icon={tabIcons} >
              <Scene key="coachManagement" component={CoachManagement} hideNavBar />
              <Scene key="pastPractices" component={PastPractices} hideNavBar />
              <Scene key="paymentOptions" component={PaymentOptions} hideNavBar />
              <Scene key="changePassword" component={ChangePassword} hideNavBar />
              <Scene key="previewProfile" component={CoachProfile} hideNavBar />
              <Scene key="addPayment" component={AddPayment} hideNavBar />
              <Scene key="pastCoachings" component={PastCoachings} hideNavBar />
              <Scene key="availibility" component={Availibility} hideNavBar />
              <Scene key="payout" component={Payout} hideNavBar />
              <Scene key="coachPayment" component={BanksAndCards} hideNavBar />
              <Scene key="personalInfo" component={PersonalInfo} hideNavBar />
              <Scene key="support" component={Support} hideNavBar />
              <Scene key="legal" component={Legal} hideNavBar />
              <Scene key="requiredDocs" component={RequiredDocuments} hideNavBar />
              <Scene key="takePic" component={TakePic} hideNavBar />
              <Scene key="termsOS" component={TermsOS} hideNavBar />
              <Scene key="mentorInfo" component={MentorInfo} hideNavBar />
              <Scene key="relevantClasses" component={RelevantClasses} hideNavBar />
            </Scene>
          </Scene>

          <Scene key="paymentOptions" component={PaymentOptions} hideNavBar />
          <Scene key="createLesson" component={CreateLesson} hideNavBar />
          <Scene key="requestCity" component={RequestCity} hideNavBar />
          <Scene key="findCoaches" component={FindCoaches} hideNavBar />
          <Scene key="profile" component={CoachProfile} hideNavBar/>
          <Scene key="bookingSignup" component={BookingSignup} hideNavBar/>
          <Scene key="signup" component={Signup} hideNavBar />
          <Scene key="coachLocker" component={CoachLocker} hideNavBar />
         </Stack>
      </Router>
    );
  }
};

const styles = ScaledSheet.create({
  tabs: {
    backgroundColor: '#FEF7F0',
    borderTopWidth: '2@ms',
    borderColor: '#FEF7F0',
  },
  item: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '27@ms',
    height: '27@ms',
    alignSelf: 'center',
  },
  label: {
    fontSize: '14@ms',
  },
})

export default RouterComponent;
