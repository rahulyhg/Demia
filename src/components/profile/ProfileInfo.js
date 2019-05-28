import React, { Component } from 'react';
import firebase from 'react-native-firebase';
const _ = require('lodash');
import { Actions } from 'react-native-router-flux';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Block,
  SignupSection,
  Section,
  BackNavBar,
  DangerBtn,
} from '../common';
import { OptionsSection, OptionItem } from '../containers';
import { RatingModal } from '../modals';
import { connect } from 'react-redux';
import { logoutUser, saveProfile, fetchProfile } from '../../actions';
import {
  ScaledSheet,
  verticalScale,
  scale,
  moderateScale,
} from 'react-native-size-matters';
import { formatPhoneNumber, unformatPhoneNumber } from '../../util/phone';
import {formStyle} from '../../stylesheet';

var t = require('tcomb-form-native');
var Form = t.form.Form;

var User = t.struct({
  parentName: t.String,
  email: t.String,
  phone: t.String,
});

var options = {
  stylesheet: formStyle,
  fields: {
    parentName: {
      label: 'Parent Name',
      placeholder: 'First Last',
    },
    email: {
      label: 'Email',
      placeholder: 'example@example.com',
      keyboardType: 'email-address',
    },
    phone: {
      label: 'Phone',
      placeholder: '123 123 1234',
      keyboardType: 'phone-pad',
    },
  }
};


class ProfileInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: {
        email: this.props.user.email,
        parentName: this.props.user.name,
        phone: formatPhoneNumber(this.props.user.phone),
      },
      showProfile: true,
      showReview: false,
      alerted: true,
      message: '',
      edited: false,
    }
  }

  componentDidMount() {
    this.props.fetchProfile()
  }

  //changes profile info field
  onChange(value) {
    this.setState({ value, edited: true });
  }

  //updates profile info on new db info
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        value: {
          email: nextProps.user.email,
          parentName: nextProps.user.name,
          phone: formatPhoneNumber(nextProps.user.phone),
        }
      })
    }

    if (nextProps.message) {
      if (this.state.alerted == false ) {
        this.alertNameChanged(nextProps.message);
      }
    }
  }

  renderProfileForm() {
    if (this.state.showProfile) {
      return (
        <View style={styles.formView}>
          <Form
            ref="form"
            type={User}
            options={options}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
          />
        </View>
      );
    }
  }

  //saves any new profile info to db
  saveBtnPressed = () => {
    if (this.state.showProfile) {
      var info = this.refs.form.getValue()
      info.phone = unformatPhoneNumber(info.phone);

      if (info) {
        this.setState({ alerted: false, edited: false })
        this.props.saveProfile(info);
      }
    }
  };

  alertNameChanged(message) {
    Alert.alert(
      message,
      "Your account information has been changed.",
      [
        {text: "Ok", },
      ],
      { cancelable: false }
    )
  }

  onBackBtnPressed = () => {
    if (this.state.edited) {
      Alert.alert(
        'Wait...',
        'Are you sure you want to exit without saving?',
        [
          {text: 'Nope'},
          {text: "I'm Sure", onPress: () => Actions.pop()},
        ],
        { cancelable: false }
      )
    } else {
      Actions.pop()
    }
  }

  toggleProfileForm() {
    this.setState({ showProfile: !this.state.showProfile });
  }

  render() {
    return (
      <Block>
        <BackNavBar
          drawerPress={this.onBackBtnPressed}
          titleViewStyle={{ marginLeft: scale(-55) }}
        />

        <ScrollView>
          <Text style={styles.header}>Edit your profile information</Text>
          {this.renderProfileForm()}

          <TouchableOpacity onPress={this.saveBtnPressed} style={styles.saveBtn}>
            <Text style={styles.save}>Save Changes</Text>
          </TouchableOpacity>

        </ScrollView>

      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  formView: {
    margin: '20@ms',
    marginRight: '30@ms',
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '32@ms',
    margin: '5@ms',
    color: 'dimgrey',
  },
  saveBtn: {
    margin: '30@ms',
    backgroundColor: '#314855'
  },
  save: {
    fontFamily: 'Raleway-BoldItalic',
    fontSize: '25@ms',
    color: '#fff',
    textAlign: 'center',
    padding: '4@ms',
  }
})

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

export default connect(mapStateToProps, {fetchProfile, saveProfile})(ProfileInfo);
