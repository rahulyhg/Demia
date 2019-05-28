import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  GreenBtn,
  SignupSection,
} from '../common';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

class CreditOption extends Component {
  renderSub() {
    if (this.props.subscription) {
      return (
        <Text>Subscription</Text>
      )
    }
  }

  render() {
    const { price, period, credits, pressed } = this.props
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.priceText}>${price} </Text>
          <Text style={styles.headerText}>{period}</Text>
          <Text style={styles.infoText}>Includes <Text style={styles.credit}>{credits}</Text> lesson Credits</Text>
        </View>
        <SignupSection>
          <GreenBtn onPress={pressed}> Select </GreenBtn>
        </SignupSection>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginTop: '10@ms',
    backgroundColor: '#fff',
    padding: '10@ms',
    borderRadius: '4@ms',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  priceText: {
    textAlign: 'center',
    fontSize: '40@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
  },
  headerText: {
    textAlign: 'center',
    fontSize: '18@ms',
    fontFamily: 'Roboto-Italic',
  },
  infoText: {
    textAlign: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Regular',
  },
  credit: {
    textAlign: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
  },
});

export { CreditOption };
