import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Block,
  NavBar,
} from '../common';
import {
  Locker,
  CoachOverview,
  RequestBubble,
} from '../containers';
import { connect } from 'react-redux';
import {
  fetchProfile,
} from '../../actions'
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

class CoachLocker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: require('../../../assets/icons/filler.png'),
      test: {},
      practices: [],
      empty: false,
      scheduledCount: 0,
      unscheduledCount: 0,
      week: 0,
    }
  }

  componentDidMount() {
    this.props.fetchProfile();
    this.fetchScheudle()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        profilePic: nextProps.user.picture,
      });
    }
  }

  fetchScheudle() {
    var ids = [];
    var unscheduledCount = 0;
    var scheduledCount = 0;
    var weekCount = 0;
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('coaches').doc(user.uid)
      .collection('practices').onSnapshot((querySnap) => {
        querySnap.forEach((doc) => {
          const scheduled = doc.data().scheduled;
          const id = doc.data().id;
          const date = doc.data().date;
          var today = new Date();
          var week = new Date();
          week.setDate(today.getDate() + 5);

          if (!ids.includes(id) && scheduled == true && date > today) {
            scheduledCount++
            if (date > today && date < week) {
              weekCount++
              this.setState({ week: weekCount });
            }
            ids.push(id);
            this.setState({ scheduledCount: scheduledCount })
          } else if (!ids.includes(id) && scheduled == false) {
            unscheduledCount++
            ids.push(id);
            this.setState({ unscheduledCount: unscheduledCount })
          }
        })
      })
  }

  render() {
    const description = "WHO WE ARE";
    return (
      <Block >
        <NavBar
          title="Your Locker"
          drawerPress={() => Actions.pop()}
          titleViewStyle={{marginLeft: scale(-20) }}
        />
        <ScrollView>
          <CoachOverview
            profilePic={this.state.profilePic}
            scheduled={this.state.scheduledCount}
            unscheduled={this.state.unscheduledCount}
            week={this.state.week}
          />
          <Locker title="Demia Doctrine" pressed={() => Actions.lockerRoom(lockerInfo[0])} />
          <View style={styles.hallway}>
            <Locker title="Mentor Mindset" pressed={() => Actions.lockerRoom(lockerInfo[1])}/>
            <Locker title="Character Guide" pressed={() => Actions.lockerRoom(lockerInfo[2])}/>
          </View>

        </ScrollView>
      </Block>
    );
  }
}

const moreAboutUs = "Demia is an educational community centered around peer-to-peer mentorship in academics. The Coaches Locker is our educational tool for both the Demia Mentors and the students they are mentoring.";
const coachingMindset = "";
const athleticMindset = "";
const disciplineGuide = "";
const characterGuide = "";

const lockerInfo = [
  { title: "Who we are", info: moreAboutUs },
  { title: "Coaching mindset", info: coachingMindset },
  { title: "Athletic mindset", info: athleticMindset },
  { title: "Discipline guide", info: disciplineGuide },
  { title: "Character guide", info: characterGuide },
];

const styles = ScaledSheet.create({
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  hallway: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
})

const mapStateToProps = state => {
  const {
    name, email, phone, user, reason, experience,
    position, sport, location, city, activated, picture,
    message,
   } = state.profile;

   return {
     name, email, phone, user, reason, experience,
     position, sport, location, city, activated, picture,
     message,
   };
}

export default connect(mapStateToProps, {fetchProfile})(CoachLocker);
