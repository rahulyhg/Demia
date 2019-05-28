import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

const Button = ({ onPress, children, style }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle, style]}
      >
    <Text style={textStyle}>
      {children}
    </Text>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  buttonStyle: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#ef5a30',
    marginLeft: '40@s',
    marginRight: '40@s',
    height: '38@vs',
    justifyContent: 'center',
    borderRadius: 4
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    paddingTop: '2@vs',
    paddingBottom: '2@vs',
    fontSize: '21@ms',
    fontFamily: 'Roboto-Bold'
  }
})

export { Button };
