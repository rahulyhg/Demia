import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

class TimeSlotCard extends Component {

  renderMorn() {
    const {morning} = this.props
    const { hourText } = styles;

    if (morning) {
      return (
        <Text style={hourText}>{morning ==true? "Morning": "" }</Text>
      )
    }
  }

  renderAft() {
    const {afternoon} = this.props
    const { hourText } = styles;

    if (afternoon) {
      return (
        <Text style={hourText}>{afternoon == true? "Afternoon": ""}</Text>
      )
    }
  }

  renderEven() {
    const {evening} = this.props
    const { hourText } = styles;

    if (evening) {
      return (
        <Text style={hourText}>{evening == true? "Evening": ""}</Text>
      )
    }
  }

  render() {
    const {day} = this.props
    const { container, dayText, slotContainer } = styles;

    return (
      <View style={container}>
        <Text style={dayText}>{day}</Text>
        <View style={slotContainer}>
          {this.renderMorn()}
          {this.renderAft()}
          {this.renderEven()}
        </View>
      </View>
    )
   }
}

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: '14@ms',
    // borderRightWidth: '2@ms',
    // borderColor: 'dimgrey',
    flex: 1,
    padding: '10@ms',
  },
  dayText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: '18@ms',
    color: '#314855',
    textAlign: 'center',
    flex: 1,
  },
  hourText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: '16@ms',
    color: 'dimgrey',
    textAlign: 'center',
    flex: 1,
    margin: '3@ms',
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export { TimeSlotCard };
