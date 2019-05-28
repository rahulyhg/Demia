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
import { RequestBubble } from './RequestBubble';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

class CoachPracticeCard extends Component {
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
       notes: props.notes,
       today: new Date,
    };
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onRequest() {
    this.props.edit();
  }

  renderDetails() {
    const { notes, location, today, date } = this.state;
    if (this.state.showDetails == true && today < date ) {
      return (
        <View>
          <View style={styles.details}>
            <Text style={styles.sportTextStyle}>{notes}</Text>
            <Text style={styles.sportTextStyle}>{location.neighborhood}</Text>
            {this.renderRequest()}
          </View>
          <View style={styles.requestContainer}>
            <GreenBtn onPress={() => this.onRequest()}> Request Reschedule</GreenBtn>
          </View>
        </View>
      );
    } else if (this.state.showDetails) {
      return (
        <View style={styles.details}>
          <Text style={styles.sportTextStyle}>{notes}</Text>
          <Text style={styles.sportTextStyle}>{location.neighborhood}, {location.city}</Text>
        </View>
      )
    }
  }

  renderRequest() {
    const { alerted, requestedDate, requestedNotes, requestedFormattedDate } = this.props;
    if ( alerted == true ) {
      return (
        <View>
          <Text style={styles.alertText}>Your Request: {requestedNotes}</Text>
          <Text style={styles.alertText}>Requested Date: {requestedFormattedDate}</Text>
        </View>
      );
    }
  }

  renderDidRescheduled() {
    const { didChange } = this.props;
    if (didChange == true) {
      return (
        <View>
          <Text style={styles.alertText}>Rescheduled!</Text>
        </View>
      );
    }
  }

  alertRequest() {
    if (this.props.alerted == true) {
      return (
        <View style={styles.alert}>
          <RequestBubble text="!"/>
        </View>
      )
    }
  }

  showDetails() {
    this.setState({ showDetails: !this.state.showDetails })
  }

  render() {
    const {
      containerStyle, dateStyle, dateViewStyle,
      athleteTextStyle, locPlaceStyle, detailViewStyle,
      sportTextStyle, spoAthlViewStyle, fullCard,
    } = styles;
    const { didChange } = this.props;
    const { date, sport, location, athlete, coach, time, pressed, formattedDate } = this.state;
    var cardColor = didChange == true? {borderColor: '#27a587'} : {borderColor: 'dimgrey'};

    return (
      <TouchableWithoutFeedback onPress={this.showDetails.bind(this)}>
        <View style={[fullCard, cardColor]}>
          <View style={containerStyle}>
            <View style={dateViewStyle}>
              <Text style={dateStyle}>{formattedDate}</Text>
              {this.alertRequest()}
            </View>

            <View style={styles.altCont}>
              <View style={spoAthlViewStyle}>
                <Text style={sportTextStyle} numOfLines={3}>
                Practice with <Text style={styles.athleteName}>{athlete} </Text>
                </Text>
                {this.renderDidRescheduled()}
              </View>
            </View>
          </View>

          {this.renderDetails()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = ScaledSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginLeft: '8@ms',
    marginRight: '8@ms',
    marginTop: '10@vs',
    marginBottom: '2@vs',
    backgroundColor: '#fff',
    alignSelf: 'center',
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
  dateStyle: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    marginLeft: '2@s',
  },
  detailViewStyle: {
    flexDirection: 'column',
  },
  sportTextStyle: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Raleway-Medium',
    alignSelf: 'center',
    marginRight: '10@s',
    textAlign: 'center',
  },
  spoAthlViewStyle: {
    marginLeft: '5@s',
    alignSelf: 'center',
    marginBottom: '5@vs',
    justifyContent: 'center',
  },
  altCont: {
    flex: 1,
    justifyContent: 'center',
  },
  clockImgStyle: {
    width: '20@s',
    height: '20@vs',
    marginLeft: '63@s',
    marginRight: '5@s',
  },
  locPlaceStyle: {
    marginLeft: '5@s',
    flexDirection: 'row',
    marginBottom: '10@vs',
  },
  fullCard: {
    marginLeft: '5@s',
    marginRight: '5@s',
    marginTop: '10@vs',
    marginBottom: '2@vs',
    backgroundColor: '#fff',
    borderRadius: '7@ms',
    borderWidth: '3@ms',
    borderColor: 'dimgrey',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  details: {
    borderTopWidth: '2@ms',
    borderColor: 'dimgrey',
    margin: '5@ms',
  },
  requestContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginBottom: '6@ms',
  },
  athleteName: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Raleway-SemiBold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  alertText: {
    fontSize: '20@ms',
    color: '#27a587',
    fontFamily: 'Raleway-SemiBold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  alert: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
})

export { CoachPracticeCard };
