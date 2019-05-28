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

const DropdownItem = ({ title, pressed, }) => {
  return (
    <TouchableWithoutFeedback onPress={pressed}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Account Info</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = ScaledSheet.create({
  container: {
    marginLeft: '10@ms',
    marginRight: '10@ms',
    flexDirection: 'row',
    marginTop: '10@ms',
  },
  title: {
    fontFamily: 'Raleway-Medium',
    fontSize: '23@ms',
    marginRight: '20@ms',
    marginBottom: '10@ms',
    alignSelf: 'center',
  },
});

export { DropdownItem };
