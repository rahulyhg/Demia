import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';
import {
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';

const Block = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  )
}

const styles = ScaledSheet.create({
  containerStyle: {
    backgroundColor: '#FEF7F0',
    borderColor: '#2BA888',
    marginBottom: verticalScale(-5),
    flex: 1,
    width: Dimensions.get('window').width
  },
});

export { Block };
