import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const SilentHeader = (props) => {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.textStlye}>{props.headerText}</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  textStlye: {
    fontSize: '30@ms',
    fontFamily: 'Roboto-Bold',
    color: '#27a587',
    textAlign: 'center'
  },
  viewStyle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20@vs',
    marginBottom: '10@vs',
    position: 'relative',
    borderBottomWidth: '2@vs',
    borderColor: '#393939'
  },
});

export { SilentHeader };
