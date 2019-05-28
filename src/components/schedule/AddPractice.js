import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  schedulePractice,
} from '../../actions';
import {
  FooterBtn,
  BackNavBar,
  Block,
  DropdownButton,
  SignupSection,
  GreenBtn,
  Spinner,
} from '../common';
import { TextBox } from '../containers';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { UnscheduledCard, PracticeCard } from '../containers';
import DateTimePicker from 'react-native-modal-datetime-picker';
import firebase from 'react-native-firebase';
import moment from 'moment'
import { CachedImage } from 'react-native-cached-image'
import RNCalendarEvents from 'react-native-calendar-events';

class AddPractice extends Component {
  constructor(props) {
    super(props);
    var today = new Date()
    today.setDate(today.getDate() + 2);

    this.state = {
      showModal: false,
      isDateTimePickerVisible: false,
      coach: 'Select Coach',
      athlete: 'Athlete',
      formattedDate: 'Date',
      date: '',
      minDate: '',
      loading: false,
      practices: {},
      empty: false,
      color: styles.greyBorder,
      toggle: false,
      showModal: false,
      practice: {
        coach: 'Alex Durmitov',
        lesson: {
        },
        athlete: {
          athleteName: 'Sam',
        },
      },
      location: 'Map Location',
      notes: '',
      dateText: null,
    }
  }

  componentDidMount() {
    this.fetchSchedule();
    var twoDaysLater = new Date()
    twoDaysLater.setDate(twoDaysLater.getDate() + 2)
    this.setState({ minDate: twoDaysLater })
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    var formattedDate = moment(date).format("MM/DD/YY h:mm a")
    this.setState({formattedDate: `${formattedDate}`, date: date})
    this._hideDateTimePicker();
  };

  onCloseModal() {
    this.setState({ showModal: false });
  }

  onSchedule(item) {
    this.setState({ practice: item, showModal: !this.state.showModal });
  }

  fetchSchedule() {
    this.setState({ loading: true });
    const user = firebase.auth().currentUser;
    const practices = [];
    firebase.firestore().collection('users').doc(user.uid).collection('lessons')
    .where("scheduled", "==", false).get().then((querySnap) => {
      if (querySnap.empty == true) {
          this.setState({empty: true});
      }
      querySnap.forEach((doc) => {
        practices.push(doc.data());
        
        this.setState({
          practices: practices,
          loading: false,
        })
      })
      console.log(practices)
    }).then(() => {
      this.setState({ loading: false });
    }).catch(() => console.log('error'));
  }

  renderUnscheduled(practices) {
      return (
        <FlatList
          data={practices}
          renderItem={({ item }) => (
            <UnscheduledCard
              coach={item.coach}
              athlete={item.prep.name}
              selected={() => this.onSchedule(item)}
              color={this.state.color}
            />
          )}
          keyExtractor={ item => item.id.toString()}
        />
      );
  }

  mapLocation() {
    this.setState({ location: 'Location' });
    console.log('notes: ', this.state.notes);
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <View style={{marginTop: verticalScale(20)}}>
          <Spinner />
        </View>
      );
    }
  }

  //used for modal bellow
  schedule() {
    if (this.state.date != '' && this.state.date > this.state.minDate) {
      const date = this.state.date
      const id = this.state.practice.id
      const coachId = this.state.practice.coachId
      const formattedDate = this.state.formattedDate
      const notes = this.state.notes
      const location = this.state.location
      const price = this.state.practice.sessionPrice

      const info = {id, date, price, coachId, formattedDate, notes, location}
      this.props.schedulePractice(info)
      if (this.props.loading == false) {
        this.setState({ showModal: false })
        Actions.pop({ref: true})
      }
    } else {
      let text = "A lesson must be scheduled 2 days prior"
      this.setState({ dateText: text })
    }
  }

  saveToCalendar = (id, date, notes) => {
    let details = {
      id : id,
      startDate: moment(date).format(),
      endDate: moment(date).add(1, 'hours').format(),
      notes: notes,
    }
    RNCalendarEvents.saveEvent('Demia Session', details)
  }

  getData(text) {
    this.setState({ notes: text })
  }

  render() {
    return (
      <Block style={{justifyContent: 'space-between'}}>
        <BackNavBar
          title="Schedule Lessons"
          drawerPress={() => Actions.pop({ ref: true })}
          titleViewStyle={{ marginLeft: scale(-20) }}
        />


        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, marginBottom: verticalScale(10)}}>
          {this.renderLoading()}
          {this.renderUnscheduled(this.state.practices)}
        </ScrollView>

        <Modal
          visible={this.state.showModal}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
        >
          <TouchableWithoutFeedback onPress={this.onCloseModal.bind(this)}>
              <View style={container}>

                <TouchableOpacity onPress={() => this.onCloseModal()}>
                  <CachedImage
                    source={require('../../../assets/icons/x.png')}
                    style={styles.xIcon}
                  />
                </TouchableOpacity>

                <UnscheduledCard
                  athlete={this.state.practice.coach}
                  coach={this.state.practice.coach}
                  color={{marginLeft: 10}}
                />
                <SignupSection>
                  <TextBox placeholder="Additional notes" typed={(text) => this.getData(text)}/>
                </SignupSection>

                <SignupSection>
                  <DropdownButton
                    onPress={this._showDateTimePicker}
                    imgURL={require('../../../assets/icons/greySchedule.png')}
                    style={{borderColor: 'dimgrey'}}
                    text={{color: 'dimgrey'}}
                  >
                    {this.state.formattedDate}
                  </DropdownButton>
                </SignupSection>

                <Text style={styles.dateText}>{this.state.dateText == null? '' : this.state.dateText }</Text>


                <SignupSection >
                  <GreenBtn
                    onPress={() => this.schedule()}
                  >Schedule</GreenBtn>
                </SignupSection>
              </View>
          </TouchableWithoutFeedback>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode="datetime"
            minuteInterval={30}
            minimumDate={this.state.minDate}
          />
        </Modal>
      </Block>
    );
  };
}

const styles = ScaledSheet.create({
  greyBorder: {
    borderColor: 'dimgrey',
  },
  greenBorder: {
    borderColor: '#E64834',
  },
  background: {
    backgroundColor: '#fff',
  },
  scheduleBtn: {
    backgroundColor: '#fff',
    marginLeft: '30@s',
    marginRight: '10@s',
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    marginTop: '10@s',
  },
  scheduleText: {
    fontSize: '17@ms',
    fontFamily: 'Roboto-Regular',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    margin: '10@s',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  // containerStore: {
  //   flex: 1,
  //   backgroundColor: '#rgba(12,12,12,0.5)',
  // },
  container: {
    backgroundColor: '#fff',
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
    flex: 1,
  },
  section: {
    marginLeft: scale(13),
    marginRight: scale(13),
    borderRadius: 10,
  },
  xIcon: {
    width: '37@ms',
    height: '37@ms',
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  dateText: {
    color: 'red',
    fontSize: '18@ms',
    textAlign: 'center',
  },
  dateContainer: {
    height: '70@ms',
    margin: '8@ms',
    alignSelf: 'center',
    position: 'relative',
  },
})

const { container, section, scheduleText, nameContainer, coachContainer, nameText, coachText, background } = styles;

const mapStateToProps = state => {
  const { loading, booked } = state.booking;

  return {
    loading,
    booked,
  }
};

export default connect(mapStateToProps, {schedulePractice})(AddPractice);
