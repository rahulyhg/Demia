import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

const NumberedBlock = ({ data, name }) => {
  const { container, number, title, } = styles;
  return (
    <TouchableWithoutFeedback>
      <View style={container}>
        <Text style={number}>{data}</Text>
        <Text style={title}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = ScaledSheet.create({
  container: {
    marginRight: '15@ms',
  },
  number: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    textAlign: 'center',
  },
  title: {
    fontSize: '15@s',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#787878',
  },
});

export { NumberedBlock };
