import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const IntroSection = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: moderateScale(3),
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    borderColor: '#ddd',
    position: 'relative',

  },
});

export { IntroSection };
