import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

const OptionItem = ({ option, onPress }) => {
  const { containerStyle, textStyle } = styles;
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Text style={textStyle}>{option}</Text>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  containerStyle: {
    marginLeft: '10@s',
    marginRight: '10@s',
    marginBottom: '5@vs',
    justifyContent: 'center',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
  },
  textStyle: {
    fontSize: '23@ms',
    fontFamily: 'Raleway-Regular',
    color: 'dimgrey',
    margin: '8@ms',
    marginBottom: '12@ms',
  },
});

export { OptionItem };
