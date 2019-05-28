import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  ScrollView,
  Alert,
} from 'react-native';
import {
  Block,
  NavBar,
  DangerBtn,
} from '../common';
import { OptionsSection, OptionItem } from '../containers';
import { RatingModal } from '../modals';
import { connect } from 'react-redux';
import {
  logoutUser,
  fetchProfile,
 } from '../../actions';
import {
  scale,
} from 'react-native-size-matters';


class ManageProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReview: false,
      alerted: true,
      message: '',
    };
  }

  componentWillMount() {
    this.props.fetchProfile()
  }

  onLogout() {
    this.logoutAlert()
  }

  logoutAlert() {
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

  profile = () => {
    Actions.profileInfo()
  }

  athletes() {
    Actions.athletes()
  }

  pastPractices() {
    Actions.pastPractices({ role: 'users' });
  }

  paymentOptions() {
    Actions.paymentOptions()
  }

  password() {
    Actions.changePassword()
  }

  toggleReview() {
    this.setState({ showReview: !this.state.showReview });
  }

  support() {
    Actions.support()
  }

  legal() {
    Actions.legal()
  }

  manageUsers = () => {
    Actions.manageUsers({ currentPrep: this.props.user.currentPrep })
  }

  render() {
    return (
      <Block>

        <NavBar drawerPress={() => Actions.pop()}
          titleViewStyle={{marginLeft: scale(30) }}
          title="Account Info"
        />
        <ScrollView>
          <OptionsSection>
            <OptionItem option="Profile Info" onPress={this.profile}/>
            <OptionItem option="Manage Users" onPress={this.manageUsers}/>

            <OptionItem option="Past Lessons" onPress={this.pastPractices.bind(this)}/>
            <OptionItem option="Payments" onPress={this.paymentOptions.bind(this)} />
            <OptionItem option="Change Password" onPress={this.password.bind(this)}/>
          </OptionsSection>
          <OptionsSection title="About Us">
            <OptionItem option="Support" onPress={this.support.bind(this)}/>
            <OptionItem option="Legal" onPress={this.legal.bind(this)}/>
          </OptionsSection>

          <DangerBtn onPress={this.onLogout.bind(this)}>Sign out</DangerBtn>
        </ScrollView>

        <RatingModal
          visible={this.state.showReview}
          toggleVis={() => this.setState({showReview: !this.state.showReview})}
        />
      </Block>
    )
  }
}

const mapStateToProps = state => {
  const { error, loading } = state.auth;
  const {  name, email, phone, user, message } = state.profile;

  return {
    error,
    loading,
    name,
    email,
    phone,
    user,
    message,
  }
}

export default connect(mapStateToProps, { logoutUser, fetchProfile })(ManageProfile);
