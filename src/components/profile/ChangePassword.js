import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {
  Block,
  BackNavBar,
  SignupSection,
  GreenBtn,
} from '../common';
import { changePassword } from '../../actions';
import { connect } from 'react-redux';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-cached-image';
import {formStyle} from '../../stylesheet';

var t = require('tcomb-form-native');
var Form = t.form.Form;
const _ = require('lodash');

var Request = t.struct({
  oldPassword: t.String,
  newPassword: t.String,
  confirmation: t.String,
});

var options = {
  stylesheet: formStyle,
  fields: {
    oldPassword: {
      label: 'Old Password',
      placeholder: 'password',
    },
    newPassword: {
      label: 'New Password',
      placeholder: 'better password',
      secureTextEntry: true,
    },
    confirmation: {
      label: 'Confirm Password',
      placeholder: 'same better password',
      secureTextEntry: true,
    },
  }
}

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmation: '',
      }
    };
  }

  onType(value) {
    this.setState({ form: value });
  }

  renderForm() {
    return (
      <KeyboardAvoidingView behavior="position">

          <View style={styles.formView}>
            <Form
              ref="form"
              type={Request}
              options={options}
              value={this.state.form}
              onChange={this.onType.bind(this)}
            />
          </View>
      </KeyboardAvoidingView>
    );
  }

  renderBtn() {
    return (
      <TouchableOpacity style={styles.btn} onPress={this.changePassword.bind(this)}>
        <Text style={styles.btnText}>Change my password</Text>
      </TouchableOpacity>
    );
  }

  changePassword() {
    const oldPassword = this.state.form.oldPassword;
    const newPassword = this.state.form.newPassword;
    const confirmation = this.state.form.confirmation;
    var info = this.refs.form.getValue();

    if (newPassword == confirmation && confirmation != '') {
      this.props.changePassword(oldPassword, newPassword);
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          titleViewStyle={{marginLeft: scale(-34)}}
        />
        <Text style={styles.header}>Password management</Text>
        <View style={styles.container}>
          {this.renderForm()}
          {this.renderBtn()}
        </View>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  formView: {
    paddingLeft: scale(20),
    paddingRight: scale(20),
    paddingTop: verticalScale(0),
    paddingBottom: verticalScale(10),
    marginBottom: verticalScale(5),
    borderRadius: 10,
  },
  container: {
    margin: '10@ms',
    paddingTop: '5@vs',
    paddingBottom: '5@vs',
    marginTop: '10@vs',
   },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
    marginLeft: '15@ms',
  },
  btn: {
    backgroundColor: '#314855',
    marginLeft: '30@ms',
    marginRight: '30@ms',
  },
  btnText: {
    fontFamily: 'Raleway-BoldItalic',
    fontSize: '23@ms',
    color: '#fff',
    textAlign: 'center',
    padding: '5@ms',
  },
})

const mapStateToProps = (state) => {
  const { message } = state.profile;

  return {
    message,
  }
};

export default connect(mapStateToProps, {changePassword})(ChangePassword);
