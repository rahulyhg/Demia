import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class BankCard extends Component {
  onPress() {
    this.props.pressed()
  }

  render() {
    const { bankName, last4 } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => this.onPress()}>
        <View style={styles.routingContainer}>
          <CachedImage
            source={require('../../../assets/icons/bank.png')}
            style={styles.img}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.routingText}>{bankName? bankName: ''}</Text>
            <Text style={styles.routingText}>{last4? `Checking ${last4}`: 'Tap to update'}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = ScaledSheet.create({
  img: {
    width: '30@ms',
    height: '30@ms',
    alignSelf: 'center',
    marginLeft: '4@ms',
  },
  routingContainer: {
    flexDirection: 'row',
    borderBottomWidth: '3@ms',
    borderColor: '#878787',
    paddingBottom: '10@ms',
    marginLeft: '20@ms',
    marginRight: '20@ms',
    marginTop: '10@ms',
  },
  infoContainer: {
    marginLeft: '20@ms',
  },
  routingText: {
    fontFamily: 'Raleway-Medium',
    fontSize: '17@ms',
    color: 'dimgrey',
    marginLeft: '5@ms',
  },
})

export {BankCard}
