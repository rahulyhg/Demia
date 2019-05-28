import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import {
  SignupSection,
  GreenBtn,
} from '../common';
import { RequestBubble } from './RequestBubble';
import {
  ScaledSheet,
} from 'react-native-size-matters';

class PracticeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
       date: props.date,
       formattedDate: props.formattedDate,
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

  onEdit() {
    this.props.edit();
  }

  renderDetails() {
    const { notes, location, today, date } = this.state;
    if (location.city != undefined) {
      var printedLocation = `${location.neighborhood}, ${location.city}`
    }
    if (this.state.showDetails == true && today < date ) {
      return (
        <View style={styles.details}>
          <Text style={styles.sportTextStyle}>{notes? notes: '(no notes)'}</Text>
          <Text style={styles.sportTextStyle}>{location.neighborhood}</Text>
          {this.renderRequest()}
          <SignupSection>
            <GreenBtn onPress={this.onEdit.bind(this)}>Edit</GreenBtn>
          </SignupSection>
        </View>
      );
    } else if (this.state.showDetails) {
      return (
        <View style={styles.details}>
          <Text style={styles.sportTextStyle}>{notes? notes: '(No notes)'}</Text>
          <Text style={styles.sportTextStyle}>{printedLocation}</Text>
        </View>
      )
    }
  }

  showDetails() {
    this.setState({ showDetails: !this.state.showDetails })
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

  renderRequest() {
    const { requestedNotes, requestedFormattedDate } = this.props;
    if (this.props.alerted) {
      return (
        <View>
          <Text style={styles.alertText}>{requestedNotes}</Text>
          <Text style={styles.alertText}>Requested Date: {requestedFormattedDate}</Text>
        </View>
      );
    }
  }

  render() {
    const {
      containerStyle, dateStyle, dateViewStyle,
       detailViewStyle,
      sportTextStyle, spoAthlViewStyle, fullCard,
    } = styles;
    const { athlete, coach, formattedDate } = this.state;
    const splitDate = formattedDate? formattedDate.split(' '): ['1', '1', '1']
    const day = splitDate[0]
    const _time = splitDate[1] + splitDate[2]
    return (
      <TouchableWithoutFeedback onPress={this.showDetails.bind(this)}>
        <View style={fullCard}>
          <View style={containerStyle}>
            <View style={dateViewStyle}>
              <Text style={dateStyle}>{day}</Text>
              <Text style={dateStyle}>{_time}</Text>
                {this.alertRequest()}
            </View>

            <View style={detailViewStyle}>
              <View style={spoAthlViewStyle}>
                <Text style={sportTextStyle} numOfLines={3}>
                {`${athlete}  |`} Session with <Text style={styles.coachName}>{coach}</Text>
                </Text>
              </View>
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
  dateStyle: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    marginLeft: '2@s',
  },
  detailViewStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  sportTextStyle: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Raleway-Medium',
    alignSelf: 'center',
    textAlign: 'center',
  },
  spoAthlViewStyle: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: '10@vs',
    marginLeft: '5@ms',
    marginRight: '5@ms',
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
    marginTop: '5@ms',
    marginLeft: '5@ms',
    marginRight: '5@ms',
  },
  coachName: {
    fontSize: '20@ms',
    color: '#353538',
    fontFamily: 'Raleway-SemiBold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  alert: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  alertText: {
    fontSize: '20@ms',
    color: '#27a587',
    fontFamily: 'Raleway-SemiBold',
    alignSelf: 'center',
    textAlign: 'center',
  },
})

export { PracticeCard };
