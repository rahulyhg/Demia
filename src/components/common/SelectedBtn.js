import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

class SelectedBtn extends Component {
  render() {
    const { pressed, selected, btnStyle, textStyle, title } = this.props;
    const color = selected? '#E9452B' : 'dimgrey';
    return (
      <TouchableOpacity onPress={pressed} activeOpacity={.5}>
        <View style={[styles.container, {borderColor: color}, btnStyle]}>
          <Text style={[styles.title,{color: color}, textStyle]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#FFFBEF',
    borderRadius: '5@ms',
    borderWidth: '2@ms',
    borderColor: 'dimgrey',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
    marginRight: '20@ms',
    marginLeft: '20@ms',
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Roboto-Regular',
    fontSize: '20@ms',
    margin: '5@ms',
    marginLeft: '20@ms',
    marginRight: '20@ms',
    color: 'dimgrey',
    textAlign: 'center',
  },
})

export {SelectedBtn};
