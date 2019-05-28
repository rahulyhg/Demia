import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Block,
  BackNavBar,
} from '../common';
import {
  Locker,
  RequestBubble,
} from '../containers';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

class MenteeRoom extends Component {
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

  render() {
    const description = "WHO WE ARE";
    return (
      <Block >
        <BackNavBar
          title="Your Locker"
          titleViewStyle={{ marginLeft: scale(-50) }}
        />

        <ScrollView>
          <Locker title="VarsityPrep Doctrine" pressed={() => Actions.menteeRoom(lockerInfo[0])} />
          <View style={styles.hallway}>
            <Locker title="Mentee Mindset" pressed={() => Actions.menteeRoom(lockerInfo[1])}/>
            <Locker title="Competitive Mindset" pressed={() => Actions.menteeRoom(lockerInfo[2])}/>
          </View>
          <View style={styles.hallway}>
            <Locker title="DISCIPLINE Guide" pressed={() => Actions.menteeRoom(lockerInfo[3])}/>
            <Locker title="CHARACTER Guide" pressed={() => Actions.menteeRoom(lockerInfo[4])}/>
          </View>
        </ScrollView>
      </Block>
    );
  }
}

const moreAboutUs = "VarsityPrep is an educational community centered around peer-to-peer mentorship in sports. The Coaches Locker is our educational tool for both the VarsityPrep Coaches and the Young Athletes they are mentoring.";
const coachingMindset = "";
const athleticMindset = "";
const disciplineGuide = "";
const characterGuide = "";

const lockerInfo = [
  { title: "Who we are", info: moreAboutUs },
  { title: "Mentee mindset", info: coachingMindset },
  { title: "Competitive mindset", info: athleticMindset },
  { title: "Discipline guide", info: disciplineGuide },
  { title: "Character guide", info: characterGuide },
];

const styles = ScaledSheet.create({
  hallway: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
})

export default MenteeRoom;
