import React, { Component } from 'react';
import {
  View,
  Switch,
} from 'react-native'

class FlipSwitch extends Component {
  onChangeValue = () => {
    this.props.changeValue()
  }

  render() {
    return (
      <View style={{ alignSelf: 'center' }}>
        <Switch 
          value={this.props.value} onValueChange={() => this.onChangeValue()} 
          trackColor={{ true: "blue", false: null }}
        />
      </View>
    );
  }
}

export {FlipSwitch};
