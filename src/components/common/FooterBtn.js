import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';


const FooterBtn = ({ title, onPress, style, text }) => {
  const { containerStyle, textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={[containerStyle, style]}>
      <Text style={[textStyle, text]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  containerStyle: {
    backgroundColor: '#EA4900',
    justifyContent: 'center',
    shadowOffset: {width: 1, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .7,
    shadowRadius: '4@ms',
    borderRadius: '4@ms',
  },
  textStyle: {
    fontSize: '26@ms',
    fontFamily: 'Raleway-BoldItalic',
    color: '#fff',
    padding: '6@ms',
    textAlign: 'center',
  }
});

export { FooterBtn };
