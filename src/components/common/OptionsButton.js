import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const OptionsButton = ({ onPress, children, style }) => {
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
    flex: .8,
    height: '40@vs',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: '2@ms',
    borderColor: '#ef5a30',
    borderRadius: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: '15@s',
    marginRight: '15@s',
    marginTop: '10@vs',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  textStlye: {
    color: '#ef5a30',
    fontWeight: '700',
    marginTop: '2@vs',
    marginBottom: '3@vs',
    fontSize: '22@ms',
    alignSelf: 'center'
  },
  directionStyle: {
    width: '50@s',
    height: '50@vs',
    backgroundColor: '#000',
    position: 'absolute'
  },
})

export { OptionsButton };
