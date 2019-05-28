import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';


const Header = (props) => {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.textStlye}>{props.headerText}</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  textStlye: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: '#ef5a30'
  },
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
});

export { Header };
