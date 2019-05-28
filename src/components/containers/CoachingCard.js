import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  SignupSection,
  GreenBtn,
} from '../common';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class CoachingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
       date: props.date,
       formattedDate: props.formattedDate,
       sport: props.sport,
       location: props.location,
       athlete: props.athlete,
       coach: props.coach,
       time: props.time,
       showDetails: false,
       loacation: props.loaction,
       notes: props.notes,
       today: new Date,
       img: require('../../../assets/icons/wistle.png'),
    };
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  renderDetails() {
    const { notes, location, today, date } = this.state;
    if (this.state.showDetails == true && today < date ) {
      return (
        <View style={styles.details}>
          <Text style={styles.sportTextStyle}>Notes and Stuff</Text>
          <Text style={styles.sportTextStyle}>Montrose</Text>
          <SignupSection>
            <GreenBtn>Map</GreenBtn>
            <GreenBtn>Edit</GreenBtn>
          </SignupSection>
        </View>
      );
    } else if (this.state.showDetails) {
      return (
        <View style={styles.details}>
          <Text style={styles.sportTextStyle}>Note and stuff</Text>
          <Text style={styles.sportTextStyle}>Montrose</Text>
        </View>
      )
    }
  }

  showDetails() {
    this.setState({ showDetails: !this.state.showDetails })
    console.log('show details ', this.state.showDetails);

  }

  render() {
    const {
      containerStyle,
      dateViewStyle,
      sportTextStyle,
      fullCard,
      img,
      imgContainer,
      infoText,
      infoContainer,
      dateText,
    } = styles;
    const { date, sport, location, athlete, coach, time, pressed, formattedDate } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.showDetails.bind(this)}>
        <View style={fullCard}>
          <View style={containerStyle}>
            <View style={imgContainer}>
              <CachedImage
                source={this.state.img}
                style={img}
              />
            </View>
            <View style={infoContainer}>
              <Text style={infoText}>Soccer with Jullian</Text>
              <Text style={dateText}>4/25/18 12:30 PM</Text>
            </View>
          </View>
          {this.renderDetails()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = ScaledSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginLeft: '5@s',
    marginRight: '5@s',
    marginTop: '10@vs',
    marginBottom: '2@vs',
    backgroundColor: '#fff',
  },
  dateViewStyle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginLeft: '2@s',
    marginTop: '6@vs',
    marginBottom: '6@vs',
    paddingRight: '5@s',
    borderRightWidth: '2@ms',
    borderColor: 'dimgrey',
  },
  sportTextStyle: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    alignSelf: 'center',
    marginRight: '20@s',
  },
  fullCard: {
    marginLeft: '5@s',
    marginRight: '5@s',
    marginTop: '10@vs',
    marginBottom: '2@vs',
    backgroundColor: '#fff',
    borderRadius: 7,
    borderWidth: '2@ms',
    borderColor: 'dimgrey',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  details: {
    borderTopWidth: '2@ms',
    borderColor: 'dimgrey',
    margin: '3@ms',
  },
  img: {
    width: '50@ms',
    height: '50@ms',
  },
  imgContainer: {
    // borderRightWidth: '2@ms',
    borderColor: 'dimgrey',
    marginTop: '5@ms',
    marginBottom: '5@ms',
  },
  infoText: {
    fontFamily: 'Raleway-Medium',
    alignSelf: 'center',
    fontSize: '23@ms',
  },
  dateText: {
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    fontSize: '20@ms',
  },
  infoContainer: {
    marginLeft: '30@ms',
    justifyContent: 'center',
  }
})

export { CoachingCard };
