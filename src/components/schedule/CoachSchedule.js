import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { requestReschedule } from '../../actions';
import { Actions } from 'react-native-router-flux';
import { Block, NavBar, SignupSection } from '../common';
import {
  CoachPracticeCard,
  EmptyCard,
} from '../containers';
import { PracticeModal, RescheduleModal, } from '../modals';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import firebase from 'react-native-firebase';

class CoachSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      practices: {},
      practice: {},
      empty: true,
      requestNotes: '',
      unscheduledPractices: [],
    }
  }

  componentDidMount() {
    this.fetchSchedule();
    this.fetchUnschedule();
  }

  fetchUnschedule() {
    this.setState({ loading: true });
    const user = firebase.auth().currentUser;

    if (user) {
      var unscheduledPractices = [];
      firebase.firestore().collection('coaches').doc(user.uid).collection('lessons')
      .where("scheduled", "==", false).onSnapshot(querySnap => {
        var count = 0;
        querySnap.forEach((doc) => {
          unscheduledPractices.push(doc.data());
          count++;
          this.setState({
            unscheduled: count,
            unscheduledPractices: unscheduledPractices,
            add: `Unscheduled (${count})`
          })
        })
      })
    }
  }

  fetchSchedule() {
    const user = firebase.auth().currentUser;
    var practices = [];
    var prevDates = [];

    if (user) {
      firebase.firestore().collection('coaches').doc(user.uid).collection('lessons')
      .where("date", ">", new Date()).orderBy("date")
          .onSnapshot(querySnap => {
          if (querySnap.empty == true) {
              this.setState({empty: true});
          }
          practices = [];
          prevDates = [];
          querySnap.forEach((doc) => {
            this.setState({ practices: [] });
            var date = doc.data().date;
            var formattedDate = doc.data().formattedDate;

            if (!prevDates.includes(date) && formattedDate) {
              prevDates.push(date);
              practices.push(doc.data());
              this.setState({practices: practices, empty: false});
              if (doc.data().scheduled == false) {
                unscheduledCount++
              }
            }
            this.setState({practices: practices});
        })
      })
    }
  }

  schedule(id, date, coachId, formattedDate, notes, location) {
    if (this.state.date != 'Date') {
      const date = this.state.date;
      const id = this.state.practice.id;
      const coachId = this.state.practice.coachId;
      const formattedDate = this.state.formattedDate;
      const notes = this.state.notes;
      const location = this.state.location;

      this.props.schedulePractice(id, date, coachId, formattedDate, notes, location);
    }
  }

  unscheduled() {
    const unscheduledPractices = this.state.unscheduledPractices;
    Actions.unscheduledPractices({unscheduledPractices});
  }

  onEdit(item) {
    // console.log('item sent: ', item);
    this.setState({ practice: item, showModal: !this.state.showModal });
  }

  renderPractices() {
    var noPractices = "Looks like you don't have any practices scheduled :(";
    if (this.state.empty == true) {
      return (
        <EmptyCard text={noPractices} />
      );
    } else {
      return (
        <ScrollView style={{flex: 1}}>
          <FlatList
            data={this.state.practices}
            extraData={this.state.practices}
            renderItem={({ item }) => (
              <CoachPracticeCard
                coach={item.coach}
                athlete={item.prep.name}
                color={this.state.color}
                sport={item.lesson.sport}
                date={item.date}
                formattedDate={item.formattedDate}
                location={item.location}
                notes={item.notes}
                alerted={item.requestChange}
                requestedDate={item.requestedDate}
                requestedNotes={item.requestedNotes}
                requestedFormattedDate={item.requestedFormattedDate}
                didChange={item.didChange}
                edit={() => this.onEdit(item)}
              />
            )}
            keyExtractor={ item => item.id.toString()}
          />
        </ScrollView>
      )
    }
  }

  renderModal() {
    if (this.state.showModal) {
      return (
        <RescheduleModal
          practice={this.state.practice}
          color={{marginLeft: 10}}
          showModal={this.state.showModal}
          closeModal={() => this.setState({showModal: !this.state.showModal})}
          schedulePractice={this.schedule.bind(this)}
          formattedDate={this.state.practice.formattedDate}
          requestNotes={this.state.requestNotes}
          location={this.state.practice.location}
          request={(date, formattedDate, notes, practice) => this.props.requestReschedule(date, formattedDate, notes, practice)}
        />
      )
    }
  }

  render() {
    return (
      <Block>
        <NavBar
          titleViewStyle={{marginLeft: scale(-30)}}
          rightBtn={this.state.add}
          optionPress={() => this.unscheduled()}
          drawerPress={() => Actions.pop()}
          title="Lessons"
        />
          {this.renderPractices()}
          {this.renderModal()}
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  emptyContainer: {
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
    backgroundColor: '#fff',
  },
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    width: scale(65),
    height: verticalScale(65),
    alignSelf: 'center',
  },
})

const mapStateToProps = state => {
  const { loading, error, message, booked } = state.booking;
  const { success } = state.schedule;

  return {
    loading,
    error,
    message,
    booked,
    success,
  }
}

export default connect(mapStateToProps, {requestReschedule, }) (CoachSchedule);
