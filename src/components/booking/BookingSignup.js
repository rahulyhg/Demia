import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import {
  Block,
  BackNavBar,
  IntroSection,
  SignupSection,
  Spinner,
} from '../common';
import {
  BookingModal,
} from '../modals';
import { LessonBlock } from '../containers';
import {
  makePayment,
  fetchProfile,
  fetchPreps,
  purchaseSession,
  retrieveCard,
  fetchCurrentPrep,
} from '../../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { formStyle, splitForm} from '../../stylesheet';
var t = require('tcomb-form-native');
var Form = t.form.Form;
import moment from 'moment'

var User = t.struct({
  parentName: t.String,
  phone: t.String,
  email: t.String,
})

var location = t.struct({
  city: t.String,
  _state: t.String,
})

var Area = t.struct({
  school: t.maybe(t.String),
})

var options1 = {
  stylesheet: splitForm,
  fields: {
    athleteName: {
      label: 'Student',
      placeholder: "Sam",
    },
    student: {
      label: 'Student',
    },
    age: {
      placeholder: '13',
      keyboardType: 'numeric'
    },
    city: {
      placeholder: 'New York City',
    },
    _state: {
      placeholder: 'NY',
      label: 'State',
    },
  }
}

var areaOptions = {
  stylesheet: formStyle,
  fields: {
    school: {
      label: 'School',
      placeholder: 'Marin High School',
    }
  }
}

var options = {
  stylesheet: formStyle,
  fields: {
    parentName: {
      placeholder: 'First Last',
    },
    phone: {
      placeholder: '123 123 1234',
      keyboardType: 'phone-pad',
    },
    email: {
      placeholder: 'example@example.com',
      keyboardType: 'email-address',
    },
  }
}

class BookingSignup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alerted: false,
      isDateTimePickerVisible: false,
      date: 'Date',
      numOfLessons: '',
      price: `$${props.price}`,
      coach: {},
      user: {
        credits: this.props.uInfo.credits,
      },
      booked: false,
      modalVisible: false,
      showBooking: false,
      loading: false,
      title: `Booking`,
      value: {
        athleteName: this.props.athleteName,
        age: this.props.athleteAge,
      },
      value1: {
        parentName: this.props.uInfo.name,
        phone: this.props.uInfo.phone,
        email: this.props.uInfo.email,
      },
      value2: {
        city: this.props.city,
        _state: this.props._state,
      },
      value3: {
        school: '',
      },
    }
  }
  
  componentDidMount() {
    this.props.fetchPreps()
    this.props.fetchCurrentPrep() // send prep to action
    this.setState({
      coach: this.props.coach,
    })
    this.props.fetchProfile()
    this.props.retrieveCard()
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.booked == true) {
        console.log('booked')
        this.setState({
          modalVisible: false,
          booked: nextProps.booked,
        });
        // setTimeout(() => this.bookedAlert(), 2000);
      }

      if (nextProps.user) {
        this.setState({ user: nextProps.user });
      }
  }

   bookedAlert() {
     if (this.state.alerted == false) {
       Alert.alert(
         'Booking Made!',
         'You can now message your coach to coordinate a practice! Make sure your contact info is up-to-date!',
         [
           {text: 'Sweet!', },
         ],
         { cancelable: false }
       )
       this.setState({
         alerted: true,
       })
     }
   }

  bookDidPress() {
    var value = this.refs.form.getValue()
    if (this.state.value.student && value ) {
      this.setState({ alerted: false, showBooking: false })

      let preps = this.props.preps
      let prepId = this.state.value.student
      let prep = preps.find(x => x.prepUid == prepId)
      var user = this.state.value1
      var date = 'Date'
      var price = this.props.price
      var coach = this.props.coach
      var coachId = this.props.coachId
      var lesson = this.props.lesson

      let lessonInfo = { price, prep, coach, coachId, lesson, user, date }
      this.props.purchaseSession(lessonInfo)
    }
  }

  renderBookingModal() {
    return (
      <BookingModal
        visible={this.state.showBooking}
        cost={this.props.numOfLessons}
        price={this.props.price}
        coach={this.props.coach.name}
        book={() => this.bookDidPress()}
        toggleVis={() => this.setState({ showBooking: false })}
        mentorPic={this.props.mentorPic}
        card={this.props.card}
        currentPrep={this.props.currentPrep}
      />
    )
  }

  toggleBooking() {
    this.setState({ showBooking: !this.state.showBooking })
  }

  renderLessons() {
      return (
        <IntroSection>
          <LessonBlock
            numOfLessons={this.props.numOfLessons}
            price={this.state.price}
            coach={this.props.coach.name}
            pressed={() => this.toggleBooking()}
          />
        </IntroSection>
      );
  }

  onChange(value) {
    this.setState({ value })
  }

  onChange1(value1) {
    this.setState({ value1 })
  }

  onChange2(value2) {
    this.setState({ value2 })
  }

  onChange3(value3) {
    this.setState({ value3 })
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    var formattedDate = moment().format("MM/DD/YYYY h:mm a")
    this.setState({date: `${formattedDate}`})
    this._hideDateTimePicker()
  }

  render() {
    var preps = this.props.preps
    let o = {}
    preps.forEach(p => {
      o[[p.prepUid]] = p.name
    })
    var Preps = t.enums(o)

    var Athlete = t.struct({
      student: Preps,
    })

    return (
      <Block style={{flex: 1}}>
        <BackNavBar
          title="Book Session"
          titleText={{fontSize: moderateScale(22)}}
          titleViewStyle={{marginLeft: scale(-47)}}
        />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
          <Form
            ref="form"
            type={Athlete}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            options={options1}
          />
          <Form
            ref="form"
            type={User}
            onChange={this.onChange1.bind(this)}
            value={this.state.value1}
            options={options}
          />

      </KeyboardAwareScrollView>

        <SignupSection>
          {this.renderLessons()}
        </SignupSection>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />

        {this.renderBookingModal()}

        <Modal
          visible={this.state.modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <Spinner size="large" />
        </Modal>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    paddingTop: '10@vs',
    flex: 1,
  },
  formView: {
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    alignSelf: 'center',
  },
  formContainer: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - scale(40),
    flex: 1,
    paddingTop: '10@vs',
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
})


const mapStateToProps = state => {
  const { loading, error, booked } = state.booking
  const { user, preps, currentPrep } = state.profile
  const { card, cardError} = state.payment

  const uInfo = user
  return {
    loading,
    error,
    booked,
    uInfo,
    preps,
    card,
    currentPrep,
  }
}

const functions = { makePayment, fetchCurrentPrep, retrieveCard, purchaseSession, fetchProfile, fetchPreps }
export default connect(mapStateToProps, functions)(BookingSignup)
