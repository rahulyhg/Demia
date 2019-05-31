import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity
} from 'react-native';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import {
  Block,
  NavBar,
  FooterBtn,
  Spinner
} from '../common';
import {
  checkConnection
} from '../../actions';
import { BookingModal } from '../modals';
import { CachedImage } from 'react-native-cached-image';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      count: 1,
      showBooking: false,
      loading: false,
      navd: false,
    }
  }

  componentDidMount() {
    // this.navigate()
    this.props.checkConnection()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            Actions.book({ profile: user, role: 'user' })
          } else {
            Actions.locker({ profile: user,  role: 'coach'})
          }
        }).catch((err) => {
          console.log('caught', err)
        })
      } else {
        // console.log('no user')
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.navigate()
    }
  }

  checkNetwork() {
    // console.log('checking...')
    this.props.checkConnection()
  }

  fbListener = () => {}

  navigate = () => {
      try {
        this.fbListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            // console.log(user.uid)
            firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
              if (doc.exists) {
                Actions.book({ profile: user, role: 'user' })
                // console.log('navigating user')
              } else {
                Actions.locker({ profile: user,  role: 'coach'})
                // console.log('navigating coach')
              }
            }).catch((err) => {
              console.log('caught')
            })
          }
        })
        this.fbListener()
      } catch(err) {
        console.log(err)
      }
  }

  onLevelUpPressed() {
    Actions.createLesson({ status: this.state.status });
  }

  onAuthPressed() {
    Actions.signup({ error: ''})
  }

  renderNetworkStatus() {
    if (!this.props.isConnected) {
      return (
        <View style={styles.networkAlert}>
          <Text style={styles.networkText}>No Internet Connection!</Text>
        </View>
      )
    }
  }

  highlightConnection = () => {
    Alert.alert(
      'Limited Network Connection',
      'Please Check you network connection then come back to the app',
        [
          {text: "Ok", onPress: () => this.checkNetwork()}
        ],
      { cancelable: false }
    )
  }

  renderBtn() {
    if (this.props.isConnected) {
      return (
        <View style={styles.btnContainer}>
          <FooterBtn
            onPress={this.onLevelUpPressed.bind(this)}
            title="Get Started"
            style={styles.btn}
          />
        </View>
      );
    } else if (this.state.loading) {
      return (
        <Spinner />
      )
    } else if (!this.props.isConnected) {
      return (
        <View style={styles.btnContainer}>
          <FooterBtn
            onPress={this.highlightConnection}
            title="Check Network"
            style={styles.greyBtn}
          />
        </View>
      );
    }
  }

  renderSignup() {
    if (this.state.status == true || this.state.status == undefined) {
      return (
        <TouchableOpacity onPress={() => this.onAuthPressed()} style={styles.signupView}>
          <Text style={styles.signupText}>Sign Up / Login</Text>
        </TouchableOpacity>
      )
    }
  }

  renderNavBar() {
    if (this.state.status == false) {
      return (
        <NavBar title="Welcome" />
      );
    } else {
      return (
        <NavBar />
      );
    }
  }

  renderModal() {
    if (this.state.showBooking) {
      return (
          <BookingModal
            visible={this.state.showBooking}
          />
      )
    }
  }

  render() {
    return (
      <Block style={{backgroundColor: '#ffeeaa'}}>

          {this.renderNetworkStatus()}

        <View style={styles.contentContainer}>
            <CachedImage
              source={require('../../../assets/icons/demia_name.png')}
              style={styles.imageStyle}
            />

          <View style={styles.missionViewStyle}>
            <Text style={styles.missionText}>
              <Text style={styles.highlightedText1}>DEMIA </Text>
               CONNECTS STUDENTS WITH
              STUDENTS FOR ACADEMIC MENTORSHIP AND TUTORING
            </Text>
          </View>

          <View style={styles.end}>
            {this.renderBtn()}
            {this.renderSignup()}
          </View>
        </View>
      </Block>
    )
  }

  componentWillUnmount() {
    this.fbListener = undefined
  }
}

const styles = ScaledSheet.create({
  missionText: {
    textAlign: 'center',
    fontSize: '22@vs',
    fontFamily: 'AvenirNext-Medium',
    color: 'dimgrey',
    lineHeight: '40@vs',
  },
  highlightedText: {
    fontSize: '22@vs',
    fontFamily: 'AvenirNext-Medium',
    color: '#1BA687',
  },
  highlightedText1: {
    fontSize: '22@vs',
    fontFamily: 'AvenirNext-DemiBold',
    color: '#E9452B',
  },
  missionViewStyle: {
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '70@vs',
    marginLeft: '6@s',
    marginRight: '6@s',
  },
  lineStyle: {
    backgroundColor: '#E9452B',
    width: '240@s',
    height: '3@ms',
    borderRadius: '20@ms',
    alignSelf: 'center'
  },
  imageStyle: {
    width: '150@ms',
    height: '150@ms',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  contentContainer: {
    margin: '10@ms',
    paddingBottom: '30@ms',
    justifyContent: 'space-between'
  },
  btn: {
    flex: 1,
    backgroundColor: '#EA4900',
    padding: '4@ms',
    marginBottom: '5@ms',
    marginTop: '15@ms',
    margin: '10@ms',
  },
  greyBtn: {
    flex: 1,
    backgroundColor: '#1BA687',
    marginBottom: '5@ms',
    marginTop: '15@ms',
    margin: '10@ms',
    padding: '5@ms',
    backgroundColor: 'dimgrey',
  },
  networkAlert: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: '2@ms',
  },
  networkText: {
    alignSelf: 'center',
    color: 'dimgrey',
    fontSize: '16@ms',
    fontFamily: 'Roboto-Medium',
  },
  signupView: {
    justifyContent: 'center',
    marginTop: '15@ms',
  },
  signupText: {
    color: 'dimgrey',
    textAlign: 'center',
    fontSize: '23@s',
    fontFamily: 'Raleway-SemiBold',
  },
  btnContainer: {
    padding: '3@ms',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderRadius: '22@ms',
  },
  end: {
    marginTop: '70@ms',
  },
});

const mapStateToProps = state => {
  const { isConnected } = state.auth

  return {
    isConnected,
  }
}

export default connect(mapStateToProps, {checkConnection})(Welcome);
