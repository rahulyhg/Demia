import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import {
  ScaledSheet
} from 'react-native-size-matters';

const FormCard = ({ title, children, pressed }) => {
  return (
    <TouchableOpacity onPress={pressed} style={styles.formCard}>
      <Text style={styles.title} >{title}</Text>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: '23@ms',
    color: '#787878',
  },
  formCard: {
    padding: '5@ms',
    borderBottomWidth: '2@ms',
    borderColor: '#314855',
    margin: '15@ms',
    marginRight: '30@ms',
  },
})

export {FormCard};
