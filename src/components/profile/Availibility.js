import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
  LayoutAnimation,
} from 'react-native';
import {
  Block,
  BackNavBar,
  SignupSection,
  SelectedBtn,
} from '../common';
import firebase from 'react-native-firebase';
import { AvailibilityCard } from '../containers';
import { TimeCard } from '../complexContainers';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  setAvailibility,
  fetchAvailability,
 } from '../../actions';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
const _ = require('lodash');
import { CachedImage } from 'react-native-cached-image';


class Availibility extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availibility: [],
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {},
      updated: false,
    }
  }

  componentDidMount() {
    this.props.fetchAvailability()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.availability) {
      console.log(nextProps.availability)
      _.forEach(nextProps.availability, (day) => {
        var d = day.day.toLowerCase()
        console.log('day', [d])
        this.setState({ [d]: day })
      })
    }
  }

  onBackBtnPressed = () => {
    if (this.state.updated) {
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
    const a = undefined;
    const monday = (this.state.monday == a? false: this.state.monday);
    const tuesday = (this.state.tuesday ==a? false: this.state.tuesday);
    const wednesday = (this.state.wednesday == a? false: this.state.wednesday);
    const thursday = (this.state.thursday == a? false: this.state.thursday);
    const friday = (this.state.friday == a? false: this.state.friday);
    const saturday = (this.state.saturday == a? false: this.state.saturday);
    const sunday = (this.state.sunday == a? false: this.state.sunday);
    var availibility = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
    availibility = _.filter(availibility, (day) => {return !_.isEmpty(day)})
    console.log('availibility: ', availibility)
    this.setState({ updated: false })
    this.saveAvailibility(availibility);
  }

  saveAvailibility(availibility) {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('coaches').doc(user.uid)
      .update({
        availibility: availibility,
      }).then(() => {
        Alert.alert("Availability Saved!")
      }).catch((err) => {
        Alert.alert("Something went wrong, try again.")
      })
  }

  renderTimeCard() {
    return (
      <View>
        <TimeCard
          day="Monday"
          options={this.state.monday}
          update={(daySlot) => this.setState({ monday: daySlot, updated: true })}
        />
        <TimeCard
          day="Tuesday"
          options={this.state.tuesday}
          update={(daySlot) => this.setState({ tuesday: daySlot, updated: true })}
        />
        <TimeCard
          day="Wednesday"
          options={this.state.wednesday}
          update={(daySlot) => this.setState({ wednesday: daySlot, updated: true })}
        />
        <TimeCard
          day="Thursday"
          options={this.state.thursday}
          update={(daySlot) => this.setState({ thursday: daySlot, updated: true })}
        />
        <TimeCard
          day="Friday"
          options={this.state.friday}
          update={(daySlot) => this.setState({ friday: daySlot, updated: true })}
        />
        <TimeCard
          day="Saturday"
          options={this.state.saturday}
          update={(daySlot) => this.setState({ saturday: daySlot, updated: true })}
        />
        <TimeCard
          day="Sunday"
          options={this.state.sunday}
          update={(daySlot) => this.setState({ sunday: daySlot, updated: true })}
        />
      </View>
    )
  }

  render() {
    return (
      <Block>
        <BackNavBar
          rightBtn="Save"
          optionPress={this.onSave}
          titleViewStyle={{marginLeft: scale(16) }}
          drawerPress={this.onBackBtnPressed}
        />
        <ScrollView>
          <Text style={styles.headerText}>Update your mentorship, teaching, or tutoring availibility</Text>

          {this.renderTimeCard()}

          <TouchableOpacity onPress={this.onSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Availability</Text>
          </TouchableOpacity>

        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  navImage: {
    width: "37@s",
    height: "37@vs",
    padding: "10@ms",
    marginTop: "10@ms",
  },
  headerText: {
    color: 'dimgrey',
    fontSize: '30@ms',
    fontFamily: 'Montserrat-ExtraBold',
    marginLeft: '10@ms',
    marginTop: '5@ms',
    marginBottom: '15@ms',
  },
  container: {
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '20@ms',
    margin: '10@ms',
  },
  saveBtn: {
    width: '230@ms',
    height: '50@ms',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '20@ms',
    marginTop: '10@ms',
    backgroundColor: '#314855'
  },
  saveText: {
    color: '#fff',
    fontSize: '22@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const {
    loading,
    availability,
  } = state.coach;

  return {
    loading,
    availability,
  };
}

export default connect(mapStateToProps, {setAvailibility, fetchAvailability})(Availibility);
