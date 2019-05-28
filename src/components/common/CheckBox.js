import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters';


class CheckBox extends Component {
  render() {
    const { pressed, selected } = this.props
    const check =  selected? {backgroundColor: '#E95F5C'} : {backgroundColor: '#fff'};
    return (
      <TouchableOpacity onPress={pressed} style={styles.box}>
        <View style={[styles.check, check]} />
      </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  box: {
    borderColor: 'dimgrey',
    borderRadius: '3@ms',
    borderWidth: '2@ms',
    height: '30@ms',
    width: '30@ms',
    backgroundColor: '#FFFBEF',
    justifyContent: 'center',
  },
  check: {
    backgroundColor: '#fff',
    height: '20@ms',
    width: '20@ms',
    alignSelf: 'center',
  },
})

export  { CheckBox };
