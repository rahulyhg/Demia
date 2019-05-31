import React, { Component } from 'react';
import {
  View,
  FlatList,
  Alert,
  Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import {
  rateCoach,
  fetchAvailability,
  fetchProfile,
  fetchThreads,
  reportUser,
  blockUser,
  removeMentor,
} from '../../actions'
import {
  NavBar,
  Block,
  Spinner,
} from '../common';
import {
  ScaledSheet,
  verticalScale,
  scale,
} from 'react-native-size-matters';
import { ContactItem, EmptyCard } from '../containers';
import { ContactModal, RatingModal, ReportModal } from '../modals';

const emptyText = "Looks like You haven't scheduled a practice yet :(";
class ContactCoach extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coaches: null,
      empty: true,
      showModal: false,
      item: {},
      showRating: false,
      loading: false,
      showReport: false
    }
  };

  componentDidMount() {
    this.props.fetchProfile()
    this.props.fetchThreads()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      Alert.alert(nextProps.message);
    }
    if (nextProps.user) {
      this.setState({ user: nextProps.user })
    }
  }

  onCloseModal() {
    this.setState({ showModal: false })
  }

  submitRating(rating) {
    if (rating) {
      console.log('rating: ', rating);
      const coachId = this.state.item.id
      this.props.rateCoach(rating, coachId);
    }
  }

  submitReport(report) {
    if (report) {
      this.props.reportUser(report)
      this.setState({ showReport: !this.state.showReport })
      setTimeout(() => this.reportAlert(), 100)
    }
  }

  reportAlert() {
    const name = this.state.item.mentor.name
    let title = name + ' has been reported'
    Alert.alert(
      title,
      '',
      [
        {text: 'Ok', onPress: () => console.log('alerted')},
      ],
      { cancelable: false }
    )
  }

  blockUser = () => {
    const mentorId = this.state.item.mentor.id
    this.props.blockUser(mentorId)
  }

  blockAlert() {
    const name = this.state.item.mentor.name
    let title = 'Are you sure you want to block ' + name
    let sTitle = 'This will stop them from contacting you in any way'
    Alert.alert(
      title,
      sTitle,
      [
        {text: 'No, Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.blockUser()},
      ],
      { cancelable: false }
    )
  }

  queryMentors() {
    try {
      const user = firebase.auth().currentUser;
      firebase.firestore().collection('users')
      .doc(user.uid).collection('mentors').get()
      .then((querySnap) => {
        if (querySnap.empty) {
          return this.setState({ empty: true, loading: false })
        }

        mentors = []
        querySnap.forEach((doc) => {
          mentors.push(doc.data())
          this.setState({ empty: false, loading: false, mentors: mentors })
        })
      })
    } catch(err) {
      console.log(err)
    }
  }

  renderBtn() {
    return (
      <Button
        onPress={() => Actions.messageThread()}
        title="Messages"
        color="#841584"
        accessibilityLabel="Go to messages"
      />
    )
  }

  renderCoaches() {
    const noCoaches = "When you book a lesson, the mentor(s) you book will appear here.";
    if (this.props.mentorThreads.length < 1) {
      return (
        <EmptyCard text={noCoaches}/>
      )
    } else {
      // console.log(this.props.mentorThreads)
      return (
          <FlatList
            data={this.props.mentorThreads}
            extraData={this.props}
            renderItem={({ item }) => (
              <ContactItem
                mentor={item.mentor}
                pressed={() => {
                  this.setState({
                    item: item,
                    showModal: !this.state.showModal
                  })}
                }
              />
            )}
            keyExtractor={ item => item.id.toString() }
          />
      )
    }
  }

  renderRatingModal() {
    // console.log(this.state.user)
    if (this.state.showRating == true) {
      return (
        <RatingModal
          visible={this.state.showRating}
          toggleVis={() => this.setState({showRating: !this.state.showRating})}
          submit={(rating) => this.submitRating(rating)}
          pic={this.state.item.mentor.picture}
          user={this.state.user}
        />
      )
    }
  }

  renderReportingModal() {
    // console.log(this.state.user)
    if (this.state.showReport) {
      return (
        <ReportModal
          visible={this.state.showReport}
          toggleVis={() => this.setState({showReport: !this.state.showReport})}
          submit={(rating) => this.submitReport(rating)}
          pic={this.state.item.mentor.picture}
          user={this.state.user}
        />
      )
    }
  }

  showRating() {
    this.setState({
      showRating: !this.state.showRating,
    })
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

  renderContactModal() {
    if (this.state.showModal) {
      return (
        <ContactModal
          visible={true}
          close={() => this.setState({ showModal: false })}
          pressed={this.onCloseModal.bind(this)}
          coach={this.state.item}
          onRating={() => this.showRating()}
          toggleVis={() => this.setState({ showModal: !this.state.showModal })}
          toggleReport={() => this.setState({ showReport: !this.state.showReport })}
          blockUser={() => this.blockAlert()}
          removeMentor={(id) => this.props.removeMentor(id)}
        />
      )
    }
  }

  render() {
    return (
      <Block>
        <NavBar
          title="Mentors"
          drawerPress={() => Actions.pop()}
          titleViewStyle={{marginLeft: scale(-10) }}
        />

        {this.renderLoading()}
        {this.renderCoaches()}
        {this.renderContactModal()}
        {this.renderRatingModal()}
        {this.renderReportingModal()}
      </Block>
    );
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
  imageStyle: {
    width: scale(65),
    height: verticalScale(65),
    alignSelf: 'center',
  },
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  containerStore: {
    backgroundColor: '#rgba(178, 178, 178, 0.5)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    marginTop: '250@vs',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
  },
})

const mapStateToProps = state => {
  const { error, loading, message } = state.booking;
  const { user } = state.profile;
  const {availability, mentorThreads, threadLoading } = state.coach

  return {
    error,
    loading,
    message,
    availability,
    user,
    mentorThreads,
    threadLoading
  };
}

export default connect(mapStateToProps, {rateCoach, fetchAvailability, fetchProfile, fetchThreads, reportUser, blockUser, removeMentor})(ContactCoach);
