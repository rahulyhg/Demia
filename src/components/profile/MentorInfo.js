import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  LayoutAnimation,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, { Component } from 'react';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import VPStatusBar from '../../VPStatusBar';
import { Actions } from 'react-native-router-flux';
import {
  Block,
  NavBar,
  SignupSection,
  GreenBtn,
  DangerBtn,
  ActivatedBtn,
  BackNavBar,
} from '../common';
import {
  DropdownItem,
  OptionItem,
  OptionsSection,
  RequiredItem,
  FormCard,
} from '../containers';
import {
  CheckboxOptions,
} from '../complexContainers'
import ImgPicker from './ImgPicker';
import { connect } from 'react-redux';
import {
  saveProfile,
  fetchProfile,
  fetchNearbySchools,
} from '../../actions';
import { formatPhoneNumber, unformatPhoneNumber } from '../../util/phone';
import { CachedImage } from 'react-native-cached-image';
var _ = require('lodash')
var t = require('tcomb-form-native')
var Form = t.form.Form;
import { formStyle, splitForm, multiLine } from '../../stylesheet';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';

var User = t.struct({
  name: t.String,
  email: t.String,
  phone: t.String,
})

var Guardian = t.struct({
  guardianName: t.String,
  guardianEmail: t.String,
  guardianPhone: t.String,
})

var Mentor = t.struct({
  highSchool: t.String,
  subject: t.list(t.String),
  experience: t.String,
  reason: t.String,
})

var Location = t.struct({
  city: t.String,
  _state: t.String,
})

var options = {
  stylesheet: formStyle,
  fields: {
    name: {
      label: 'Your Name',
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
}

var guardianOptions = {
  stylesheet: formStyle,
  fields: {
    guardianName:  {
      label: 'Parent/Guardian Name',
      placeholder: 'First Last',
    },
    guardianEmail: {
      label: 'Parent/Guardian Email',
      placeholder: 'example@example.com',
      keyboardType: 'email-address',
    },
    guardianPhone: {
      label: 'Parent/Guardian Phone',
      placeholder: '123 123 1234',
      keyboardType: 'phone-pad',
    },
  }
}

var mentorOptions = {
  stylesheet: formStyle,
  fields: {
    highSchool: {
      label: 'School',
      placeholder: 'Hogwarts Academy',
    },
    subject: {
      label: 'Subject(s)',
      placeholder: 'Biology',
    },
    experience: {
      label: 'My Subject',
      placeholder: "Why you're qualifed to tutor your subject(s)",
      multiline: true,
      numberOfLines: 20,
      stylesheet: multiLine,
    },
    reason: {
      label: 'Why I love Being a VarsityPrep Mentor',
      placeholder: 'Why you enjoy mentoring students',
      multiline: true,
      numberOfLines: 20,
      stylesheet: multiLine,
    },
  },
}

var locationOptions = {
  stylesheet: splitForm,
  fields: {
    city: {
      label: 'City',
      placeholder: 'New York City',
    },
    _state: {
      label: 'State',
      placeholder: 'NY',
    },
  }
}

class MentorInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      profile: {
        email: '',
        name: '',
        phone: '',
      },
      guardian: {
        guardianEmail: '',
        guardianName: '',
        guardianPhone: '',
      },
      mentor: {
        highSchool: '',
        subject: '',
        reason: '',
        name: '',
        picture: '',
      },
      location: {
        city: '',
        _state: '',
      },
      showProfile: false,
      showMentor: false,
      showGuardian: false,
      edited: false,
      alerted: true,
      pricing: false,
      pricingAmount: '',
      showLocation: false,
      o1: false,
      o2: false,
      o3: false,
      showSchools: false,
    }
  }

  componentDidMount() {
    this.props.fetchProfile()
  }

  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      // console.log('user', nextProps.user);
      const { email, name, phone, guardianName, guardianEmail, guardianPhone }  = nextProps.user
      const {city, highSchool, location, reason, sport, _state} = nextProps.user

      if (guardianName && guardianEmail && guardianPhone ) {
        //first check for empty string ''
        const parent = [guardianName, guardianEmail, guardianPhone]
        this.setState({ requireGuardian: this.checkEmptyArray(parent) })
      } else {
        this.setState({ requireGuardian: true })
      }

      if(email && name && phone) {
        const user = [email, name, phone]
        this.setState({ requireProfile: this.checkEmptyArray(user) })
      } else {
        this.setState({ requireProfile: true })
      }

      if (city  && highSchool && reason && sport && _state) {
        const mentor = [city, highSchool, location, reason, sport, _state]
        this.setState({ requireMentor: this.checkEmptyArray(mentor) })
      } else {
        this.setState({ requireMentor: true })
      }

      this.setState({
        profile: {
          email: nextProps.user.email,
          name: nextProps.user.name,
          phone: formatPhoneNumber(nextProps.user.phone),
        },
        guardian: {
          guardianName: nextProps.user.guardianName,
          guardianEmail: nextProps.user.guardianEmail,
          guardianPhone: formatPhoneNumber(nextProps.user.guardianPhone),
        },
        pricingAmount: nextProps.user.sessionPrice
      })
    }

    if (nextProps.user) {
      this.setState({
        mentor: {
          highSchool: nextProps.user.highSchool,
          subject: nextProps.user.subject,
          reason: nextProps.user.reason,
          experience: nextProps.user.experience,
          picture: nextProps.user.picture,
          name: nextProps.user.name,
          activated: nextProps.user.activated,
        },
        activated: nextProps.user.activated,
        location: {
          city: nextProps.user.city,
          _state: nextProps.user._state,
        },
        zipcode: nextProps.user.zipcode,
        radius: nextProps.user.tutoringRadius,
      })

      if (nextProps.user.tutoringRadius !== this.state.radius) {
        this.setState({ radius: nextProps.user.tutoringRadius })
        switch (nextProps.user.tutoringRadius) {
          case 1:
            this.checkBoxPressed('o1')
            break;
          case 3:
            this.checkBoxPressed('o2')
            break;
          case 5:
            this.checkBoxPressed('o3')
            break;
          default:
        }
      }
    }
    //makes sure that alert doesn't pop multiple times.
    if (nextProps.message) {
      switch (nextProps.message) {
        case 'Attempt Fail':
          break;
        case 'Changes Saved!':
          this.profileSaved()
          break;
        default:
      }
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

  profileSaved() {
    if (!this.state.alerted) {
      this.setState({ alerted: true, edited: false })
      Alert.alert(
        'Update Saved!',
        'Your account information has been changed.',
        [
          {text: "Ok", onPress: () => this.setState({ alerted: true, edited: false })},
        ],
        { cancelable: false }
      )
    }
  }

  onChangeProfile = (value) => {
    this.setState({ profile: value, edited: true });
  }

  onChangeGuardian = (value) => {
    this.setState({ guardian: value, edited: true });
  }

  onChangeMentor = (value) => {
    this.setState({ mentor: value, edited: true });
  }

  onLocationChange = (value) => {
    this.setState({ location: value, edited: true });
  }

  onTogglePrice = () => {
    this.setState({ pricing: !this.state.pricing })
  }

  onToggleProfile = () => {
    this.setState({ showProfile: !this.state.showProfile })
  }

  onToggleMentor = () => {
    this.setState({ showMentor: !this.state.showMentor })
  }

  onToggleGuardian = () => {
    this.setState({ showGuardian: !this.state.showGuardian })
  }

  onToggleLocation = () => {
    this.setState({ showLocation: !this.state.showLocation })
  }

  toggleSchools = () => {
    this.setState({ showSchools: !this.state.showSchools })
  }

  checkBoxPressed(option) {
    let zip = this.state.zipcode
    switch (option) {
      case 'o1':
        this.setState({ o1: true, o2: false, o3: false })
        this.props.fetchNearbySchools(zip, 1)
        break;
      case 'o2':
        this.setState({ o1: false, o2: true, o3: false })
        this.props.fetchNearbySchools(zip, 3)
        break;
      case 'o3':
        this.setState({ o1: false, o2: false, o3: true })
        this.props.fetchNearbySchools(zip, 5)
        break;
      default:
        return;
    }
  }

  renderProfileForm() {
    if (this.state.showProfile) {
      return (
        <View style={styles.formView}>
          <ImgPicker
            image={this.state.mentor.picture}
            setAvatar={(source) => this.setState({mentor: {picture: source}}) }
          />

          <Form
            ref="form"
            type={User}
            options={options}
            value={this.state.profile}
            onChange={this.onChangeProfile}
          />
        </View>
      )
    }
  }

  renderMentorForm() {
    if (this.state.showMentor) {
      return (
        <View style={styles.formView}>
          <Form
            ref="form"
            type={Location}
            options={locationOptions}
            value={this.state.location}
            onChange={this.onLocationChange}
          />
          <Form
            ref="form"
            type={Mentor}
            options={mentorOptions}
            value={this.state.mentor}
            onChange={this.onChangeMentor}
          />
        </View>
      );
    }
  }

  renderGuardianForm() {
    if (this.state.showGuardian) {
      return (
        <View style={styles.formView}>
          <Form
            ref="form"
            type={Guardian}
            options={guardianOptions}
            value={this.state.guardian}
            onChange={this.onChangeGuardian}
          />
        </View>
      )
    }
  }

  renderPricing() {
    if (this.state.pricing) {
      return (
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingInfo}>The average cost per hour tutoring session is $20, but price your services competitively.</Text>

          <View style={styles.priceInput}>
            <Text style={styles.priceSign}>$</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => this.setState({pricingAmount: text})}
              value={this.state.pricingAmount}
              placeholder="20"
            />
          </View>
        </View>
      )
    }
  }

  renderSchools() {
    if (this.state.showSchools) {
      return (
        <FlatList
          data={this.props.schools}
          renderItem={({item}) => <Text>{item.name}</Text>}
          keyExtractor={(item) => item.id}
        />
      )
    }
  }

  renderSessionInfo() {
    if (this.state.showLocation) {
      return (
        <View style={{ marginLeft: moderateScale(15), marginBottom: moderateScale(15), marginRight: moderateScale(20) }}>
          <Text style={styles.pricingInfo}>We believe Demia mentors are best at mentoring students from their own community.</Text>
          <TextInput
            style={styles.locationInput}
            onChangeText={(text) => this.setState({zipcode: text})}
            value={this.state.zipcode}
            placeholder="zip code"
          />

          <CheckboxOptions
            selected={this.state.o1}
            pressed={() => this.checkBoxPressed('o1')}
            text="All schools within 1 miles"
          />
          <CheckboxOptions
            selected={this.state.o2}
            pressed={() => this.checkBoxPressed('o2')}
            text="All schools within 3 miles"
          />
          <CheckboxOptions
            selected={this.state.o3}
            pressed={() => this.checkBoxPressed('o3')}
            text="All schools within 5 miles"
          />

          <View style={styles.schoolsContainer}>
            {this.renderSchools()}
          </View>
          <TouchableOpacity onPress={this.toggleSchools}><Text style={styles.pricingInfo}>{this.state.showSchools? '[Hide]':`[Show Schools (${this.props.schools.length})]`}</Text></TouchableOpacity>
        </View>
      )
    }
  }

  onBackBtnPressed = () => {
    if (this.state.edited) {
      Alert.alert(
        'Wait...',
        'Are you sure you want to leave without saving?',
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

  onSave = () => {
    var mentor = this.state.mentor
    var info = this.state.profile
    var guardian = this.state.guardian
    let loc = this.state.location
    let price  = this.state.pricingAmount
    let zip = this.state.zipcode
    var location = {
      _state: loc._state,
      city: loc.city,
    }

    info.phone = unformatPhoneNumber(info.phone)

    if (info && mentor && location && guardian) {
      this.props.saveProfile(info, mentor, location, guardian, price, zip)
      this.setState({ edited: false, alerted: false })
    }
  }

  renderSaved() {
    if (this.props.message === 'Changes Saved!') {
      return (
        <View>
          <Text style={styles.savedBtn}>Saved!</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title="Profile Info"
          drawerPress={this.onBackBtnPressed}
          titleViewStyle={{ marginLeft: scale(-55) }}
        />

        <KeyboardAwareScrollView>
          <Text style={styles.header}>Edit your profile information</Text>

          <FormCard pressed={this.onToggleProfile} title="Profile"/>
          {this.renderProfileForm()}

          <FormCard pressed={this.onToggleMentor} title="Activity"/>
          {this.renderMentorForm()}

          <FormCard pressed={this.onToggleGuardian} title="Parent/Guardian"/>
          {this.renderGuardianForm()}

          <FormCard pressed={this.onTogglePrice} title="Session Price"/>
          {this.renderPricing()}

          <FormCard pressed={this.onToggleLocation}  title="Mentorship Location"/>
          {this.renderSessionInfo()}

          <TouchableOpacity onPress={this.onSave} style={styles.saveBtn}>
            <Text style={styles.save}>Save Changes</Text>
          </TouchableOpacity>

          {this.renderSaved()}

        </KeyboardAwareScrollView>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  formView: {
    margin: '20@ms',
    marginTop: '10@ms',
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '32@ms',
    margin: '5@ms',
    color: 'dimgrey',
  },
  saveBtn: {
    margin: '30@ms',
    marginBottom: '10@ms',
    backgroundColor: '#314855',
    padding: '4@ms',
    width: '200@ms',
    alignSelf: 'center',
  },
  save: {
    fontFamily: 'Roboto-MediumItalic',
    fontSize: '25@ms',
    color: '#fff',
    textAlign: 'center',
  },
  pricingContainer: {
    justifyContent: 'center',
  },
  pricingInfo: {
    fontSize: '19@ms',
    color: 'dimgrey',
    textAlign: 'center',
    marginRight: '10@ms',
  },
  priceInput: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '5@ms',
  },
  inputStyle: {
    fontSize: '20@ms',
    borderColor: 'dimgrey',
    borderRadius: '5@ms',
    borderWidth: '2@ms',
    padding: '3@ms',
    marginLeft: '3@ms',
  },
  priceSign: {
    fontSize: '27@ms',
    textAlign: 'center',
    color: 'dimgrey',
  },
  locationInput: {
    fontSize: '24@ms',
    borderColor: 'dimgrey',
    borderBottomWidth: '3@ms',
    padding: '3@ms',
    marginLeft: '15@ms',
    width: '150@ms',
    margin: '10@ms',
    marginBottom: '20@ms',
  },
  schools: {
    fontFamily: 'Roboto-Medium',
    fontSize: '18@ms',
    color: 'dimgrey',
    marginTop: '10@ms',
  },
  schoolsContainer: {
    margin: '10@ms',
    marginLeft: '15@ms',
    marginTop: '5@ms',
  },
  savedBtn: {
    color: '#EA4900',
    fontSize: '18@ms',
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
    marginBottom: '30@ms',
  }
})

const mapStateToProps = state => {
  const { user, message } = state.profile
  const { schools } = state.search

  return {
    user,
    message,
    schools,
  }
}

export default connect(mapStateToProps, {saveProfile, fetchProfile, fetchNearbySchools})(MentorInfo);
