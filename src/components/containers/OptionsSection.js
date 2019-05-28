import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

const OptionsSection = ({ children, title, style, pressed, _textStyle }) => {
  const { containerStyle, textStyle, titleStyle } = styles;
  return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback onPress={pressed}>
          <View style={[titleStyle, style]}>
            <Text style={[textStyle, _textStyle]}>{title}</Text>
          </View>
        </TouchableWithoutFeedback>
        {children}
      </View>
  );
};

const styles = ScaledSheet.create({
  containerStyle: {
    justifyContent: 'center',
    margin: '10@ms',
    // borderBottomWidth: '2@ms',
    // borderColor: '#989898',
  },
  titleStyle: {
    marginLeft: '5@s',
    marginRight: '5@s',
  },
  textStyle: {
    fontSize: '24@ms',
    alignSelf: 'center',
    fontFamily: 'Montserrat-Medium',
    marginBottom: '3@vs',
    color: 'dimgrey',
    textAlign: 'center',
  },
});

export { OptionsSection };
