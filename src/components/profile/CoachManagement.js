import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  Block,
  NavBar,
  SignupSection,
  DangerBtn,
  ActivatedBtn,
} from '../common';
import { OptionItem, OptionsSection, RequiredItem } from '../containers';
import { connect } from 'react-redux';
import { logoutUser, fetchProfile, deleteProfile, activateAccount, deactivateAccount, } from '../../actions';
import { scale, verticalScale, ScaledSheet } from 'react-native-size-matters';
const _ = require('lodash');

class CoachManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      profile: {
        email: this.props.user.email,
        name: this.props.user.name,
        phone: this.props.user.phone,
      },
      guardian: {
        guardianEmail: this.props.user.guardianEmail,
        guardianName: this.props.user.guardianName,
        guardianPhone: this.props.user.guardianPhone,
      },
      coach: {
        highSchool: this.props.highSchool,
        subject: this.props.subject,
        experience: this.props.experience,
        position: this.props.position,
        reason: this.props.reason,
        name: this.props.name,
        picture: this.props.user.picture,
      },
      location: {
        city: this.props.city,
        _state: this.props._state,
      },
      area: this.props.area,
      title: 'Activate Account',
      activated: this.props.user.activated,
      showAcc: false,
      showCoach: false,
      count: 0,
      alerted: false,
      showGuardian: false,
      requireAcc: false,
      requireParent: false,
      requireMentor: false,
      requireDocs: false,
      requireIdentity: false,
    }
  }

  componentDidMount() {
    this.props.fetchProfile();

    if (!this.props.activated) {
      this.setState({ activated: false });
    } else {
      console.log('activated: ', this.state.activated);
    }
  }

  //updates profile info on new db info
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      // console.log('user', nextProps.user);
      const { email, name, phone, guardianName, guardianEmail, guardianPhone }  = nextProps.user
      const {city, experience, highSchool, location, reason, subject, _state} = nextProps.user

      if (guardianName && guardianEmail && guardianPhone ) {
        //first check for empty string ''
        const parent = [guardianName, guardianEmail, guardianPhone]
        this.setState({ requireParent: this.checkEmptyArray(parent) })
      } else {
        this.setState({ requireParent: true })
      }

      if(email && name && phone) {
        const user = [email, name, phone]
        this.setState({ requireAcc: this.checkEmptyArray(user) })
      } else {
        this.setState({ requireAcc: true })
      }

      if (city && experience && highSchool && reason && subject && _state) {
        const mentor = [city, experience, highSchool, location, reason, subject, _state]
        this.setState({ requireMentor: this.checkEmptyArray(mentor) })
      } else {
        this.setState({ requireMentor: true })
      }

      this.setState({
        profile: {
          email: nextProps.user.email,
          name: nextProps.user.name,
          phone: nextProps.user.phone,
        },
        guardian: {
          guardianName: nextProps.user.guardianName,
          guardianEmail: nextProps.user.guardianEmail,
          guardianPhone: nextProps.user.guardianPhone,
        }
      })
    }

    if (nextProps.user) {
      this.setState({
        coach: {
          highSchool: nextProps.user.highSchool,
          subject: nextProps.user.subject,
          experience: nextProps.user.experience,
          position: nextProps.user.position,
          reason: nextProps.user.reason,
          picture: nextProps.user.picture,
          name: nextProps.user.name,
          activated: nextProps.user.activated,
        },
        activated: nextProps.user.activated,
        location: {
          city: nextProps.user.city,
          _state: nextProps.user._state,
        },
        area: nextProps.user.area,
      })
    }
  }

  checkEmptyArray(array) {
    let state = false
    _.forEach(array, (obj) => {
      if (!obj || obj == '') {
        return true
      }
    })
    return state
  }

  alertEmptyInfo() {
    let info = "Before you can activate your account, you need to fill out "
  }

  renderActiveBtn() {
    if (this.state.activated) {
      return (
        <View>
          <ActivatedBtn
            title={"Account is Active"}
            selected={true}
            pressed={() => this.toggleActivatedProfile(false)}
            btnStyle={styles.activeBtn}
            titleStyle={styles.activeBtnText}
          />
          <Text style={styles.active}>An active profile will be visible to searching preps and parents</Text>
        </View>
      );
    } else {
      return (
        <ActivatedBtn
          title={"Activate Account"}
          selected={false}
          pressed={() => this.toggleActivatedProfile(true)}
        />
      )
    }
  }

  toggleActivatedProfile(isActive) {
    const {requireAcc, requireMentor, requireParent } = this.state
    if (!requireAcc && !requireMentor && !requireParent) {
      this.setState({ activated: !this.state.activated });
      if (isActive) {
        this.props.activateAccount();
      } else {
        this.deactivateAccount();
      }
    } else {
      Alert.alert('You have one or more forms that needs to be completed')
    }
  }

  deactivateAccount() {
    Alert.alert(
      'Deactivate Your Account?',
      'Are you sure you want to proceed?',
      [
        {text: "Yes", onPress: () => this.props.deactivateAccount()},
        {text: "No", style: 'cancel', onPress: () => this.setState({activated: true}) },
      ],
      { cancelable: false }
    )
  }

  previewProfile() {
    var coach = this.state.coach;
    Actions.previewProfile({ coach: coach, preview: true });
  }

  availibility() {
    Actions.availibility();
  }

  pastPractices() {
    Actions.pastPractices({ coach: true });
  }

  paymentOptions() {
    Actions.paymentOptions();
  }

  changePassword() {
    Actions.changePassword();
  }

  coachPayment() {
    Actions.coachPayment();
  }

  payout() {
    Actions.payout();
  }

  personalInfo() {
    Actions.personalInfo();
  }

  requiredDocs() {
    Actions.requiredDocs();
  }

  toMentor() {
    Actions.mentorInfo();
  }

  relevantClasses() {
    Actions.relevantClasses()
  }

  deleteProfile() {
    Alert.alert(
      'Delete Your Account?',
      'Afer 14 days of inactivity your account will be permanently deleted. Are you sure you want to proceed?',
      [
        {text: "Yes", onPress: () => this.props.deleteProfile()},
        {text: "No", style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  logout() {
    Alert.alert(
      'Log Out?',
      'Are you sure?',
      [
        {text: "Yes", onPress: () => this.props.logoutUser()},
        {text: "No", style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <Block>
        <NavBar
          titleViewStyle={{marginLeft: scale(40)}}
          title="Account"
        />

        <ScrollView>
          <OptionsSection title="">
            <OptionItem
              option="Preview Profile"
              onPress={this.previewProfile.bind(this)}
            />
            <RequiredItem
              option="Edit Profile Info"
              onPress={() => this.toMentor()}
              isRequired={this.state.requireMentor && this.state.requireAcc && this.state.requireParent}
            />
            <RequiredItem
              option="Mentorship Availability"
              onPress={() => this.availibility()}
            />

            <OptionItem option="Relevant Classes" onPress={() => this.relevantClasses()}/>
            <OptionItem option="Past Practices" onPress={() => this.pastPractices({ coach: true })}/>

            <RequiredItem
              option="Required Documents"
              onPress={this.requiredDocs.bind(this)}
              isRequired={this.state.requiredDocs}
            />

            <RequiredItem
              isRequired={this.state.requiredDocs}
              option="Financials/Identity"
              onPress={() => this.coachPayment()}
            />

            <OptionItem option="Payout" onPress={() => this.payout()}/>
            <OptionItem option="Change Password" onPress={() => this.changePassword()}/>

            <SignupSection>
              {this.renderActiveBtn()}
            </SignupSection>
          </OptionsSection>

          <OptionsSection title="Danger Zone" style={{borderColor: '#ed4438', marginTop: verticalScale(20)}}>

          <DangerBtn onPress={this.logout.bind(this)}>Log out</DangerBtn>
          <DangerBtn onPress={this.deleteProfile.bind(this)}>Delete Profile</DangerBtn>
            
          </OptionsSection>
        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  activeBtn: {
    flex: .8,
    height: '40@vs',
    alignSelf: 'center',
    backgroundColor: '#FEF7F0',
    borderWidth: '2@ms',
    borderRadius: '10@ms',
    borderColor: '#40994C',
  },
  activeBtnText: {
    color: '#40994C',
  },
  active: {
    color: 'dimgrey',
    fontSize: '17@ms',
    textAlign: 'center',
    marginTop: '5@ms',
  }
});

const mapStateToProps = (state) => {
  const { error, loading } = state.auth;
  const {  user  } = state.profile;

  return {
    user
  };
}

export default connect(mapStateToProps, { logoutUser, fetchProfile, deleteProfile, activateAccount, deactivateAccount })(CoachManagement);
