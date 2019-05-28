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

class InvoiceCard extends Component {

  formatDate(date) {
    if (date != '' && date != undefined) {
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
      var d = new Date(0);
      d.setUTCSeconds(date);

      return dateFormat(d, "mmmm dS, yyyy")
    }
  }

  render() {
    const { type, paid_at, total } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={styles.type}>{type}</Text>
          <Text style={styles.date}>{paid_at}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.total}>${total}</Text>
        </View>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '10@ms',
    marginBottom: '20@ms',
    borderBottomWidth: '1@ms',
    borderColor: 'dimgrey',
    flexDirection: 'row',
  },
  date: {
    fontSize: '17@ms',
    fontFamily: 'Montserrat-Regular',
  },
  type: {
    fontSize: '17@ms',
    fontFamily: 'Montserrat-Regular',
  },
  total: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  leftContainer: {
    flex: 1,
    marginBottom: '3@ms',
  },
  rightContainer: {
    flex: 1,
    alignSelf: 'center',
  }
})

export { InvoiceCard };
