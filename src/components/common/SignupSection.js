import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const SignupSection = ({ children, style }) => {
  return (
    <View style={[styles.containerStyle, style]}>
      {children}
    </View>
  );
};

const styles = ScaledSheet.create({
  containerStyle: {
    padding: '3@ms',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
});

export { SignupSection };
