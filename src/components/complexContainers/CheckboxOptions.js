import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import {
  ScaledSheet,
} from 'react-native-size-matters'

class CheckboxOptions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pressed: false,
    }
  }

  render() {
    let color = this.props.selected? '#314855':'#FFFBEF'
    return (
      <TouchableOpacity onPress={() => this.props.pressed()} style={styles.container}>
        <View style={styles.checkBox}>
          <View style={[styles.check, {backgroundColor: color} ]} />
        </View>
        <Text style={styles.info}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}


const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: '10@ms',
  },
  check: {
    width: '16@ms',
    height: '16@ms',
    borderRadius: '8@ms',
    backgroundColor: '#314855',
    alignSelf: 'center',
  },
  checkBox: {
    width: '22@ms',
    height: '22@ms',
    borderRadius: '11@ms',
    borderColor: 'dimgrey',
    borderWidth: '1@ms',
    marginLeft: '15@ms',
    justifyContent: 'center',
  },
  info: {
    marginLeft: '5@ms',
    fontFamily: 'Roboto-Medium',
    fontSize: '20@ms',
    color: '#314855',
  },
})

export { CheckboxOptions }
