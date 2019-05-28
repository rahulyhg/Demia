import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const DangerBtn = ({ onPress, children, style }) => {
  const { buttonStyle, textStlye, directionStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle, style]}>
      <Text style={textStlye}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  buttonStyle: {
    backgroundColor: '#EA4900',
    width: '70%',
    marginTop: '10@ms',
    marginBottom: '10@ms',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
    alignSelf: 'center',
  },
  textStlye: {
    color: '#fff',
    fontFamily: 'Roboto-BoldItalic',
    padding: '8@ms',
    fontSize: '22@ms',
    textAlign: 'center',
  },
  directionStyle: {
    width: '50@s',
    height: '50@vs',
    backgroundColor: '#000',
    position: 'absolute'
  },
})

export { DangerBtn };
