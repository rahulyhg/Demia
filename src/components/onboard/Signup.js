import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  AsyncStorage,
} from 'react-native';
import {
  signupUser,
  loginUser,
  saveApnToken,
} from '../../actions';
import {
  Card,
  Block,
  Section,
  BackNavBar,
  Input,
  Button,
  Spinner,
  SignupSection,
  FooterBtn,
  SelectedBtn,
  CheckBox,
} from '../common';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
var t = require('tcomb-form-native');
var Form = t.form.Form;
import firebase from 'react-native-firebase'
const _ = require('lodash');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CachedImage } from 'react-native-cached-image';
import {formStyle} from '../../stylesheet';

var Request = t.struct({
  name: t.String,
  email: t.String,
  password: t.String,
  confirmation: t.String,
});
var Login = t.struct({
  email: t.String,
  password: t.String,
});

var options = {
  stylesheet: formStyle,
  fields: {
    name: {
      label: 'Name',
      placeholder: 'Your Name',
      style: {fontSize: 23},
      returnKeyType: 'next',
      autoCorrect: false,
    },
    email: {
      label: 'Email',
      placeholder: 'email@example.com',
      keyboardType: 'email-address',
      returnKeyType: 'next',
      autoCorrect: false,
      autoCapitalize: 'none',
    },
    password: {
      label: 'Password',
      placeholder: 'password',
      secureTextEntry: true,
      returnKeyType: 'next',
    },
    confirmation: {
      label: 'Confirm Password',
      placeholder: 'password',
      secureTextEntry: true,
      returnKeyType: 'done',
    },
  }
};


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        email: '',
        password: '',
        confirmation: '',
      },
      selected0: false,
      selected1: false,
      signup: true,
      title: 'Sign up',
      optionTitle: 'Login',
      termsAccepted: false,
    }
  }

  animateForm() {
    const createPropery = {
      type: 'spring',
      springDamping: 0.5,
      property: 'opacity',
    }

    const updatePropery = {
      type: 'spring',
      springDamping: 0.5,
      property: 'opacity',
    }

    const deletePropery = {
      type: 'spring',
      springDamping: 0.5,
      property: 'opacity',
    }

    const animationConfig = {
      duration: 500,
      create: createPropery,
      update: updatePropery,
      delete: deletePropery,
    };

    LayoutAnimation.configureNext(animationConfig);
  }

  componentWillUpdate() {
    this.animateForm()
  }

  async saveToken() {
    fcmToken = await firebase.messaging().getToken()
    // console.log('TOKEN', fcmToken)
    this.props.saveApnToken(fcmToken)
  }

  onLoginPressed() {
    switch (this.state.signup) {
      case true:
        this.setState({ title: 'Login', optionTitle: 'Sign up', roleColor: {color: 'dimgrey'}})
        break;
      case false:
        this.setState({ title: 'Sign up', optionTitle: 'Login', })
        break;
    }
    this.setState({ signup: !this.state.signup });
  }

  //handles login/signup toggling
  toggleSelected({ count }) {
    switch(count) {
      case 0:
        this.setState({
          selected1: false,
          selected0: !this.state.selected0,
        });
        break;
      case 1:
        this.setState({
          selected0: false,
          selected1: !this.state.selected1,
        });
        break;
      default:
        this.setState({
          selected0: true,
          selected1: true,
        });
    };
  }

  onChange = (value) => {
    this.setState({ value: value });
  }

  async saveBtnPressed() {
    fcmToken = await firebase.messaging().getToken()

    var info = this.refs.form.getValue();
    if (info) {
      if (!this.state.termsAccepted && this.state.title == 'Sign up') {
        return Alert.alert('You must accept the terms of service agreement.')
      }
      const { booking, user, numOfLessons, price, coach, lesson, boo, uid } = this.props;
      const { name, email, password, confirmation} = info;
      const { selected0, selected1 } = this.state;
      var role;

      if (password == confirmation && selected0 != selected1 && info.name != null) {
        if (selected0 == true) {
          role = "Parent";
        } else {
          role = "Coach";
        }

        this.props.signupUser({ name, email, password, numOfLessons, price, coach, lesson, boo, uid, role }, fcmToken);
      } else if (email != '', password != '') {
        this.props.loginUser({ email, password }, fcmToken);
      }
    } else {
      this.setState({ roleColor: {color: '#ed4438'} });
    }
  }

  //Displays error to user on auth failed attempt
  renderError() {
    let { error } = this.props
    if (error != '') {
      let message = null
      const defaultMessage = 'Those credentials failed'
      if (error.message) {
        message = error.message.split('Error: ')
      }

      return (
        <View style={styles.errorStyle}>
          <Text style={styles.errorTextStyle}>
            {message? message: defaultMessage}
          </Text>
        </View>
      );
    }
  }

  //Displays either signup form or login form
  renderForm() {
    if (this.state.signup == true) {
      return (
        <View>
          <KeyboardAwareScrollView >
            <View style={styles.formView}>
              <Form
                ref="form"
                type={Request}
                options={options}
                value={this.state.value}
                onChange={this.onChange}
              />
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.formView}>
            <Text style={[styles.roleText, this.state.roleColor]}>Role</Text>
          </View>

          <SignupSection >
            <View style={styles.btnContainer}>
              <SelectedBtn
                title={"Mentee"}
                selected={this.state.selected0}
                pressed={this.toggleSelected.bind(this, {count: 0})}
              />
              <SelectedBtn
                title={"Mentor"}
                selected={this.state.selected1}
                pressed={this.toggleSelected.bind(this, {count: 1})}
              />
            </View>
          </SignupSection>
          {this.renderTerms()}
        </View>
      );
    } else {
      return (
        <KeyboardAvoidingView behavior="position">
          <View style={styles.formView}>
            <Form
              ref="form"
              type={Login}
              options={options}
            />
          </View>
        </KeyboardAvoidingView>
      );
    }
  }

  onTermsSelected = () => {
    this.setState({ termsAccepted: !this.state.termsAccepted })
  }

  openTerms = () => {
    Linking.openURL('https://www.demia.app/privacy')
    .catch((err) => console.log('err', err))
  }

  renderTerms() {
    return (
      <View style={styles.termsContainer}>
        <CheckBox pressed={this.onTermsSelected} selected={this.state.termsAccepted} />
        <View>
        <Text style={styles.termsText}>By checking this box you agree to</Text>
        <TouchableOpacity onPress={this.openTerms}><Text style={styles.linkText}>our terms of service</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  //button or activity indicator
  renderButton() {
    if (this.props.loading) {
      return (
        <SignupSection style={{backgroundColor: 'FFEEAA'}}>
          <Spinner size="large" />
        </SignupSection>
      )
    }
    return (
      <SignupSection style={{backgroundColor: 'FFEEAA'}}>
        <FooterBtn
          onPress={this.saveBtnPressed.bind(this)}
          title={this.state.title}
          style={styles.footer}
        />
      </SignupSection>
    );
  }

  render() {
    return (
      <Block >
        <BackNavBar
          drawerPress={() => Actions.pop()}
          rightBtn={this.state.optionTitle}
          optionPress={this.onLoginPressed.bind(this)}
          titleViewStyle={{marginLeft: scale(16) }}
          style={{backgroundColor: '#F4EBE1'}}
        />
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>{this.state.title}</Text>

            {this.renderForm()}
            {this.renderError()}
            {this.renderButton()}
          </View>
        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  errorStyle: {
  },
  errorTextStyle: {
    fontSize: '20@ms',
    alignSelf: 'center',
    color: '#DF462F',
    textAlign: 'center',
  },
  contentContainer: {
    margin: '10@ms',
    marginTop: 0,
    paddingTop: '5@vs',
    borderRadius: '7@ms',
    padding: '4@ms',
  },
  footer: {
    flex: .83,
    padding: '4@ms',
    backgroundColor: '#EA4900'
  },
  formView: {
    paddingTop: '10@ms',
    paddingLeft: '20@ms',
    paddingRight: '20@ms',
    paddingBottom: '10@ms',
    borderRadius: 10,
  },
  btnContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: '15@vs',
  },
  roleText: {
    fontFamily: 'Raleway-Medium',
    fontSize: '16@ms',
    color: 'dimgrey',
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '36@ms',
    color: 'dimgrey',
    marginLeft: '20@ms',
    marginTop: '5@ms',
  },
  termsText: {
    flex: 1,
    textAlign: 'center',
    marginLeft: '5@ms',
    fontSize: '17@ms',
  },
  linkText: {
    color: '#084C61',
    textAlign: 'center',
    marginLeft: '5@ms',
    flex: 1,
    fontSize: '17@ms',
  },
  termsContainer: {
    flex: 1,
    marginTop: '20@ms',
    marginBottom: '20@ms',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => {
  const { name, email, password, confirmation, error, loading } = state.auth;
  return {
    name,
    email,
    password,
    confirmation,
    error,
    loading,
  };
};

export default connect(mapStateToProps, { signupUser, loginUser, saveApnToken })(Signup);
