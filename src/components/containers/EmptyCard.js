import React from 'react'
import {
  View,
  Text,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SignupSection } from '../common';
import FastImage from 'react-native-fast-image';

const EmptyCard = ({text}) => {
  return (
    <View style={styles.emptyContainer}>
      <SignupSection style={{flexDirection: 'column'}}>
          <FastImage
            source={require('../../../assets/icons/owl.png')}
            style={styles.imageStyle}
          />
          <Text style={styles.uhOhText}>
            {text}
          </Text>
      </SignupSection>
    </View>
  );
}

const styles = ScaledSheet.create({
  emptyContainer: {
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
  },
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    width: '100@ms',
    height: '100@ms',
    alignSelf: 'center',
    // resizeMode: 'contain',
  },
})

export { EmptyCard};
