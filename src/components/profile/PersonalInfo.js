import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Block,
  BackNavBar,
  NavBar,
} from '../common';
import {
  submitPersonalInfo
} from '../../actions';
import { connect } from 'react-redux';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { formStyle } from '../../stylesheet';
var t = require('tcomb-form-native');
var Form = t.form.Form;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var _ = require('lodash')

var Dob = t.struct({
  firstName: t.String,
  lastName: t.String,
  birth: t.String,
  ssn: t.String,
})

var Address = t.struct({
  line1: t.String,
  line2: t.maybe(t.String),
  city: t.String,
  state: t.String,
  zip: t.String,
})

var options1 = {
  stylesheet: formStyle,
  fields: {
    line1: {
      label: 'Address Line 1',
      placeholder: '123 Home Address'
    },
    line2: {
      label: 'Address Line 2',
      placeholder: 'Optional'
    },
    city: {
      label: 'City',
      placeholder: 'Albuquerque'
    },
    state: {
      label: 'State',
      placeholder: 'NM/New Mexico'
    },
    zip: {
      label: 'Postal/Zip Code',
      placeholder: '32122'
    },
  }
};

var options = {
  stylesheet: formStyle,
  fields: {
    firstName: {
      label: 'First Name',
      placeholder: 'John',
      autoCorrect: false,
    },
    lastName: {
      label: 'Last Name',
      placeholder: 'Doe',
      autoCorrect: false,
    },
    birth: {
      label: 'Date of Birth',
      placeholder: 'mm/dd/yyyy',
    },
    ssn: {
      label: 'Last 4 SSN Digits',
      placeholder: '1234',
      secureTextEntry: true,
    },
  }
};

class PersonalInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnText: 'Next',
      showBirth: true,
      showAddress: false,
      saveBtn: false,
      showNav: true,
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
      },
      personal: {
        firstName: '',
        lastName: '',
        birth: '',
        ssn: '',
      }
    }
  }

  nextPressed() {
    let {firstName, lastName, birth, ssn } = this.state.personal
    if (firstName != '' && lastName != '' && birth != '' && ssn != '') {
      this.setState({
        showBirth: !this.state.showBirth,
        showAddress: !this.state.showAddress,
        saveBtn: !this.state.saveBtn,
        showNav: !this.state.showNav,
      })
    } else {
      var value = this.refs.form.getValue()
    }
  }

  saveInfo() {
    // this.setState({ loading: true })
    var { line1, line2, city, state, zip } = this.state.address
    if (line1 != '' && city != '' && state != '' && zip != '') {
      let personal = this.state.personal
      let address = this.state.address
      this.props.submitPersonalInfo(personal, address)
      this.alertUser()
    } else {
      var value = this.refs.form.getValue()
    }
  }

  alertUser() {
    Alert.alert(
      'Information Submitted',
      'VarsityPrep will verify your information within 1-2 days.',
      [
        {text: 'OK', onPress: () => Actions.pop({processing: true})},
      ],
      { cancelable: false }
    )
  }

  addressChange(value) {
    this.setState({ address: value })
  }

  personalChange(value) {
    this.setState({ personal: value })
  }

  renderBirthForm() {
    if (this.state.showBirth) {
      return (
        <View style={styles.formView}>
          <Form
            ref="form"
            type={Dob}
            options={options}
            value={this.state.personal}
            onChange={this.personalChange.bind(this)}
          />
        </View>
      )
    }
  }

  renderAddressForm() {
    if (this.state.showAddress) {
      return (
        <View style={styles.formView}>
          <Form
            ref="form"
            type={Address}
            options={options1}
            value={this.state.address}
            onChange={this.addressChange.bind(this)}
          />
        </View>
      )
    }
  }

  renderNextBtn() {
    if (!this.state.saveBtn) {
      return (
        <TouchableOpacity onPress={()=> this.nextPressed()} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>{this.state.btnText}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderSaveBtn() {
    if (this.state.saveBtn) {
      return (
        <View style={styles.saveBtnContainer}>
          <TouchableOpacity onPress={()=> this.nextPressed()} style={styles.backBtn}>
            <Text style={styles.nextBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.saveInfo()} style={styles.saveBtn}>
            <Text style={styles.nextBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderNav() {
    if (this.state.showNav) {
      return (
        <BackNavBar />
      )
    } else {
      return (
        <NavBar />
      )
    }
  }

  render() {
    return (
      <Block>
        {this.renderNav()}
        <ScrollView style={styles.container}>

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerView}>
              <Text style={styles.header}>Verification Information</Text>
              <Text style={styles.subHeader}>This is the minimal information required for individuals to recieve payments in the United States.</Text>
            </View>
            {this.renderBirthForm()}
            {this.renderAddressForm()}
          </KeyboardAwareScrollView>

          {this.renderNextBtn()}
          {this.renderSaveBtn()}
        </ScrollView>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#FFFAE7',
  },
  container: {
    flex: 1,
    paddingBottom: '25@ms',
  },
  headerView: {
    marginLeft: '10@ms',
    marginBottom: '10@ms',
  },
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
  },
  subHeader: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-SemiBold',
    color: 'dimgrey',
  },
  nextBtn: {
    justifyContent: 'center',
    backgroundColor: '#EA4900',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '10@ms',
  },
  nextBtnText: {
    fontSize: '22@ms',
    fontFamily: 'Raleway-BoldItalic',
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    margin: '10@ms',
    marginRight: '20@ms',
    marginLeft: '20@ms',
  },
  formView: {
    marginTop: '5@ms',
    marginBottom: '5@ms',
    marginRight: '10@ms',
    marginLeft: '10@ms',
  },
  saveBtnContainer: {
    flexDirection: 'row',
  },
  backBtn: {
    justifyContent: 'center',
    backgroundColor: 'dimgrey',
    paddingTop: '5@ms',
  },
  saveBtn: {
    justifyContent: 'center',
    backgroundColor: '#EA4900',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '5@ms',
    paddingTop: '10@ms',
    flex: 1,
  },
})

const mapStateToProps = state => {
  const { loading } = state.payment

  return {
    loading,
  }
}

export default connect(mapStateToProps, {submitPersonalInfo})(PersonalInfo);
