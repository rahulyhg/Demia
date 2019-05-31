import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Block,
  SignupSection,
  BackNavBar,
  NavBar,
  FooterBtn,
} from '../common';
import {
  SessionForm,
} from '../containers';
import {
  fetchProfile,
  getSchools,
  fetchSearchTerms,
  alertUserSMS,
  getCities,
  setMentorSettings,
  saveApnToken,
  reverseGeocode,
  autoComplete,
  queryMentors,
  zipTyped,
} from '../../actions';
import { ScaledSheet, moderateScale, scale } from 'react-native-size-matters';
import firebase from 'react-native-firebase';
var _ = require('lodash')
import AsyncStorage from '@react-native-community/async-storage';

class CreateLesson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: 'School',
      locationKey: 'City',
      schoolKey: 'School',
      time: 'Time',
      ready: "Find a Mentor",
      addCity: "Don't see your Activity?",
      user: {
        credits: 0,
      },
      activityStatus: false,
      schools: [],
      activities: [],
      cities: [],
      subject: '',
    };
  };

  componentWillUpdate() {
    setTimeout(() => LayoutAnimation.easeInEaseOut(), 10)
  }

  componentDidMount() {
    this.props.fetchProfile();
    const query = firebase.firestore().collection('coaches')
    .where("activated", "==", true)
    this.props.fetchSearchTerms(query)
    // this.props.setSearchParams()
    this.getToken()
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    // console.log(fcmToken)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ user: nextProps.user });
    }
    if (nextProps.schools) {
      this.setState({ schools: nextProps.schools })
    }
    if (nextProps.searchInfo) {
      let { activities, cities, schools } = nextProps.searchInfo
      activities = _.uniqBy(activities, 'activity')
      cities = _.uniqBy(cities, 'city')
      schools = _.uniqBy(schools, 'school')
      this.setState({ activities, cities, schools })
    }
  }

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
        this.setState({ position: position });
        this.props.reverseGeocode(position);
      },(error) => {
        if (error.PERMISSION_DENIED) {
          alert(`Please check your location permisions.`)
        }
        console.log('mark 3', error)
        this.setState({ error: error.message, locLoading: false, loading: false })
      },{ enableHighAccuracy: false, timeout: 3000, maximumAge: 1000 }
    );
  }

  addCity = () => {
    Actions.requestCity();
  }

  readyButtonPressed() {
    Actions.findCoaches({zip: this.props.zip, subject: this.state.subject });
  }

  renderNavBar() {
    var user = firebase.auth().currentUser;
    if (!user) {
      return (
        <BackNavBar
          titleViewStyle={{marginLeft: scale(-47)}}
        />
      );
    } else {
      return (
        <NavBar
          title="Welcome Back"
          titleViewStyle={{marginLeft: scale(-12)}}
        />
      )
    }
  }

  renderRequest() {
    let shift = this.state.subject && this.props.zip.length > 4? { textAlign: 'center'} : {};
    return (
      <TouchableOpacity
        style={styles.requestContainer}
        onPress={this.addCity}
      >
        <Text style={[styles.request, shift]}>{this.state.addCity}</Text>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    if (this.state.subject && this.props.zip.length > 4) {
      return (
        <SignupSection style={{marginTop: moderateScale(20)}}>
          <FooterBtn style={styles.footer} title={this.state.ready} onPress={this.readyButtonPressed.bind(this)}/>
        </SignupSection>
      )
    }
  }

  render() {
    return (
      <Block>
        {this.renderNavBar()}

        <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>

          <SessionForm
            autoComplete={(search) => this.props.autoComplete(search, 'subject')}
            results={this.props.results}
            subjectTyped={(s) => this.setState({ subject: s })}
            zipTyped={(z) => this.props.zipTyped(z)}
            getZip={this.getLocation}
            zip={this.props.zip}
          />

            {this.renderFooter()}
            {this.renderRequest()}

        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  contentContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  request: {
    fontSize: '19@ms',
    color: '#314855',
    fontFamily: 'AvenirNext-DemiBold',
  },
  footer: {
    flex: .87,
    backgroundColor: '#EA4900'
  },
  requestContainer: {
    marginTop: '10@ms',
    marginBottom: '10@ms',
    marginLeft: '15@ms',
  }
})

const mapStateToProps = state => {
  const { sport, location } = state.auth;
  const { user } = state.profile;
  let { schools, activities, cities, results, zip } = state.search;

  return {
    sport,
    location,
    user,
    schools,
    activities,
    cities,
    schools,
    results,
    zip
  }
}

let funcs = { fetchProfile, queryMentors, getSchools, setMentorSettings, getCities, autoComplete, fetchSearchTerms, alertUserSMS, saveApnToken, reverseGeocode, zipTyped }
export default connect(mapStateToProps, funcs)(CreateLesson)
