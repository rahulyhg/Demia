import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const Section = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = ScaledSheet.create({
  containerStyle: {
    padding: '3@ms',
    flexDirection: 'row',
    borderColor: '#ddd',
  },
});

export { Section };
