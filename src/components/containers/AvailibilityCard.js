import React, { Component } from 'react';
import {
  View,
  Text,
  LayoutAnimation,
} from 'react-native';
import { TextBox } from './TextBox';
import {
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

class AvailibilityCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: this.props.day,
      dayTitle: props.dayTitle,
      morningSlot: false,
      afternoonSlot: false,
      eveningSlot: false,
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  sendTime(day) {
    this.props.sendTime(day);
  }

  renderTextBox() {
    return (
      <View>
        <TextBox
          placeholder="afternoon, evening, 2-7pm"
          typed={(text) => this.sendTime(text)}
          style={{margin: moderateScale(12)}}
        />
      </View>
    )
  }

  //most likely make into other components
  render() {
    const { dayTitle } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <Text style={styles.dayText}>{dayTitle}</Text>
        </View>

        {this.renderTextBox()}

      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 0,
    borderColor: '#989898',
    paddingBottom: '20@ms',
    margin: '10@ms',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: '10@ms',
  },
  dayText: {
    marginLeft: '10@ms',
    color: 'dimgrey',
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Medium',
    alignSelf: 'center',
  },
  timeSlotContainer: {
    flexDirection: 'row',
  },
  slotStyle: {
    marginLeft: '1@ms',
    marginRight: '9@ms',
  },
  slotText: {
    fontSize: '15@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
  },
});

export { AvailibilityCard };
