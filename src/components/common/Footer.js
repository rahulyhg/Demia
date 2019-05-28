import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';


const Footer = ({ title, style }) => {
  const { containerStyle, textStyle } = styles;
  return (
    <View style={[containerStyle, style]}>
      <Text style={textStyle}>{title}</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  containerStyle: {
    backgroundColor: '#2BA888',
    flex: .15,
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: '26@ms',
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    color: '#fff',
  }
});

export { Footer };
