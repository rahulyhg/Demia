import React, { Component } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { schedulePractice, reschedule, fetchSchedule, fetchLessonsToRate } from '../../actions';
import { Actions } from 'react-native-router-flux';
import { Block, NavBar, Spinner } from '../common';
import { PracticeCard, EmptyCard } from '../containers';
import { PracticeModal, EditModal } from '../modals';
import { verticalScale, ScaledSheet } from 'react-native-size-matters';
import firebase from 'react-native-firebase';
import RNCalendarEvents from 'react-native-calendar-events';
import AsyncStorage from '@react-native-community/async-storage';

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unscheduled: 0,
      add: "Add (0)",
      practices: [],
      empty: true,
      showModal: false,
      showEdit: false,
      practice: {},
      reschedules: {},
      alerted: true,
      loading: false,
    };
  };

  componentDidMount() {
    this.fetchUnschedule()
    this.props.fetchSchedule()
    // this.props.fetchLessonsToRate()
    this.retrievePermissionSettings()
  }

  saveToCalendar() {
    let d = new Date()
    let _d = new Date('2019-04-11T10:20:30')
    console.log(d.toISOString(), _d.toISOString())
    // console.log(new Date('2011-04-11T10:20:30Z'))
    try {
      let details = {
        id : 'E05A8088-8F25-43A8-A5B7-F51513C748C5',
        startDate: '2019-02-19T17:00:00.000Z',
        endDate: '2019-02-19T17:00:30.000Z',
        // notes: 'Test notes',
      }
      RNCalendarEvents.saveEvent('Demia Session', details)
      .then((resp) => {
        console.log(resp)
      }).catch(err => console.log(err))

      RNCalendarEvents.findCalendars().then((resp) => {
        console.log(resp)
      }).catch((err) => {
        console.log(err)
      })

    } catch(err) {
      console.log('caught', err)
    }
  }

  async retrievePermissionSettings() {
    try {
      const value = await AsyncStorage.getItem('permission_alerted')
      if (value) {
        return;
      } else {
        RNCalendarEvents.authorizeEventStore().then((resp) => {
          if (resp === 'denied') {
            let a = 'You have denied permission for Demia to add events to your calendar. If you would like our app to add upcoming lessons to your device calendar navigate to Settings -> Demia -> Calendars'
            Alert.alert(a)
            this.storePermissionSettings()
          }
        })
      }
    } catch(err) {
      console.log('err retrieving permission settings', err)
    }
  }

  async storePermissionSettings(settings) {
    try {
      await AsyncStorage.setItem('permission_alerted', 'alerted');
    } catch(err) {
      console.log('err saving permission settings', err)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps._message != '' && this.state.alerted == false) {
      this.setState({ alerted: true })
      Alert.alert(nextProps._message);
    }
    if (nextProps.message != '') {
      this.setState({ alerted: true })
      Alert.alert(nextProps.message);
    }
    if (nextProps.practicesInfo) {
      this.setState({
        practices: nextProps.practicesInfo.practices,
        empty: nextProps.practicesInfo.empty
      })
    }
  }

  fetchUnschedule() {
    const user = firebase.auth().currentUser;
    try {
      firebase.firestore().collection('users').doc(user.uid).collection('lessons')
      .where("scheduled", "==", false).onSnapshot(querySnap => {
        if (querySnap.empty) {
          return this.setState({ unscheduled: 0 })
        }
        var count = 0;
        querySnap.forEach((doc) => {
          count++;
          this.setState({
            unscheduled: count, add: `Add (${count})`,
           })
        })
      })
    } catch(err) {
      console.log('fetching unscheduled err');
    }
  }

  renderPractices() {
    var noPractices = "When you schedule lessons, they will appear here!";
    if (this.state.empty) {
      return (
        <EmptyCard
          text={noPractices}
        />
      );
    } else {
      return (
        <ScrollView style={{flex: 1}}>
          <FlatList
            data={this.props.practicesInfo.lessons}
            extraData={this.state}
            renderItem={({ item }) => (
              <PracticeCard
                coach={item.coach}
                athlete={item.prep.name}
                color={this.state.color}
                date={item.date}
                formattedDate={item.formattedDate}
                location={item.location}
                notes={item.notes}
                alerted={item.requestChange}
                requestedDate={item.requestedDate}
                requestedNotes={item.requestedNotes}
                requestedFormattedDate={item.requestedFormattedDate}
                edit={() => this.toggleEdit(item)}
              />
            )}
            keyExtractor={ item => item.id.toString()}
          />
        </ScrollView>
      )
    }
  }

  toggleEdit(item) {
    console.log('toggle edit modal', item);
    this.setState({ practice: item, showEdit: !this.state.showEdit });
  }

  addPracticePressed() {
    if (this.state.unscheduled > 0) {
      Actions.addPractice();
    }
  }

  renderModal() {
    if (this.state.showModal) {
      return (
        <PracticeModal
          practice={this.state.practice}
          color={{marginLeft: 10}}
          showModal={this.state.showModal}
          closeModal={() => this.setState({showModal: !this.state.showModal})}
          schedulePractice={() => this.schedule(id, date, coachId, formattedDate, notes, location)}
          formattedDate={this.state.practice.formattedDate}
        />
      )
    }
  }

  renderEditModal() {
    if (this.state.showEdit) {
      return (
        <EditModal
          showModal={this.state.showEdit}
          editPractice={(id, date, coachId, formattedDate, notes, location) => this.editPractice(id, date, coachId, formattedDate, notes, location)}
          practice={this.state.practice}
          color={{marginLeft: 10}}
          closeModal={() => this.setState({showEdit: !this.state.showEdit})}
          formattedDate={this.state.practice.formattedDate}
        />
      );
    }
  }

  editPractice(id, date, coachId, formattedDate, notes, practice) {
    console.log('hello edit practice', date);

    this.setState({ alerted: false });
    if (coachId && formattedDate && id) {
      this.props.reschedule(id, date, coachId, formattedDate, notes, practice);
    } else {
      console.log('Could not find', coachId, formattedDate, id);
    }
  }

  schedule(id, date, coachId, formattedDate, notes, location) {
    if (this.state.date != 'Date') {
      const date = this.state.date;
      const id = this.state.practice.id;
      const coachId = this.state.practice.coachId;
      const formattedDate = this.state.formattedDate;
      const notes = this.state.notes;
      const practice = this.props.location;

      this.props.schedulePractice(id, date, coachId, formattedDate, notes, location);
    }
  }

  renderLoading() {
    if (this.state.loading == true) {
      return (
        <View style={{marginTop: verticalScale(20)}}>
          <Spinner />
        </View>
      )
    }
  }

  render() {
    return (
      <Block>
        <NavBar
          title="Lessons"
          drawerPress={() => Actions.pop()}
          rightBtn={this.state.unscheduled > 0? this.state.add : ''}
          optionPress={() => this.addPracticePressed()}
        />
          {this.renderLoading()}
          {this.renderPractices()}
          {this.renderModal()}
          {this.renderEditModal()}
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  rescheudule: {
    flex: .2,
    marginLeft: '5@ms',
    marginRight: '5@ms',
    borderBottomWidth: '3@ms',
    borderColor: '#27a587',
  },
})

const mapStateToProps = state => {
  const { loading, error, message, booked } = state.booking;
  const { _message, lessonsInfo, practicesInfo } = state.schedule;
  return {
    loading,
    error,
    message,
    _message,
    booked,
    practicesInfo,
    lessonsInfo,
  }
};
const functions = {schedulePractice, reschedule, fetchSchedule, fetchLessonsToRate};
export default connect(mapStateToProps, functions)(Schedule);
