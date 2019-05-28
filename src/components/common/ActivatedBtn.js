import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

class ActivatedBtn extends Component {
  render() {
    const { pressed, btnStyle, titleStyle } = this.props;

    return (
      <TouchableOpacity onPress={pressed} activeOpacity={.5}>
        <View style={[styles.container, btnStyle]}>
          <Text style={[styles.title, titleStyle]}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
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

export {ActivatedBtn};
