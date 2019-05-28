import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

const Locker = ({ title, pressed, context, }) => {
  return (
    <TouchableWithoutFeedback activeOpacity={.5} onPress={pressed}>
      <View style={styles.locker}>
        <Text numberOfLines={3} style={styles.lockerText}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = ScaledSheet.create({
  locker: {
    flex: .5,
    borderRadius: '5@ms',
    margin: '8@ms',
    paddingTop: '20@ms',
    paddingBottom: '10@ms',
    backgroundColor: '#F4EBE1',
    justifyContent: 'center',
    borderColor: 'dimgrey',
    borderWidth: '3@ms',
  },
  lockerText: {
    fontSize: '22@ms',
    fontFamily: 'Raleway-Medium',
    marginLeft: '5@ms',
    marginRight: '5@ms',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'dimgrey',
  },
  contextText: {
    fontSize: '18@ms',
    fontFamily: 'Raleway-Medium',
    marginLeft: '5@ms',
    marginRight: '5@ms',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'dimgrey',
  },
})

export { Locker };
