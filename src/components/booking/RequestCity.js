import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  ScaledSheet, scale, verticalScale, moderateScale,
} from 'react-native-size-matters';
import { formStyle } from '../../stylesheet';
import {
  Block,
  BackNavBar,
  FooterBtn,
} from '../common';
var t = require('tcomb-form-native');
var Form = t.form.Form;

var Request = t.struct({
  email: t.String,
  location: t.String,
  sport: t.String,
});

var options = {
  stylesheet: formStyle,
  fields: {
    email: {
      label: 'Email',
      placeholder: 'email@example.com'
    },
    location: {
      label: 'School',
      placeholder: 'Marin High School'
    },
    sport: {
      label: 'Activity',
      placeholder: 'Debate, Soccer, etc...'
    },
  }
};

const message = 
"If you don't see your city, high school, or activity on the list please submit your respected information and we will work hard to add your city, high school, activity";

class RequestCity extends Component {
  constructor(props) {
    super(props);
    var user = firebase.auth().currentUser;

    this.state = {
      user,
    }
  }

  submitPressed() {
    var request = this.refs.form.getValue();
    if (request) {
      console.log('email', request)
      firebase.firestore().collection('requests').doc(request.email).set({
        email: request.email,
        location: request.location,
        sport: request.sport,
      })
      .then(() => {
        Alert.alert(
          'Thanks, Request Made!',
          'We will email you as soon as we start representing your city. In the meantime tell others in your area to make requests.',
          [
            {text: 'Sweet!', onPress: () => Actions.createLesson({ stay: true })},
          ],
          { cancelable: false }
        )
      })
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          titleViewStyle={{marginLeft: scale(-21)}}
        />

        <ScrollView>
          <Text style={styles.header}>Request School or Activity</Text>

          <KeyboardAvoidingView style={styles.contentContainer} behavior="position">

            <View style={styles.formView}>
              <Form
                ref="form"
                type={Request}
                options={options}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <FooterBtn style={styles.footerBtn} title="Submit" onPress={this.submitPressed.bind(this)}/>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  contentContainer: {
    margin: '10@ms',
    padding: '5@ms',
    borderRadius: '7@ms',
  },
  formView: {
    paddingLeft: moderateScale(20),
    paddingRight: moderateScale(20),
    paddingTop: verticalScale(0),
    paddingBottom: verticalScale(10),
    borderRadius: 10,
  },
  messageStyle: {
    fontSize: moderateScale(20),
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginBottom: verticalScale(15),
    color: 'grey',
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
    marginLeft: '15@ms',
  },
  footerBtn: {
    flex: .75,
    backgroundColor: '#EA4900',
    padding: '3@ms',
  },
});

export default RequestCity;
