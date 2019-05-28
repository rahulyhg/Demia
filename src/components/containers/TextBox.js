import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

class TextBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text,
    }
  }

  sendData(text) {
    this.setState({ text });
    this.props.typed(text);
  }

  keyboardDown(e) {
    if (e.nativeEvent.key == "Enter") {
      Keyboard.dismiss();
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.sendData(text)}
          value={this.state.text}
          multiline={true}
          numberOfLines={4}
          placeholder={this.props.placeholder}
          returnKeyType="done"
          onKeyPress={this.keyboardDown}
          autoCapitalize="sentences"
        />
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  input: {
    width: '320@ms',
    height: '80@ms',
    borderBottomWidth: '2@ms',
    borderColor: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '20@ms',
  },
  container: {
    // margin: '10@ms',
  },
});

export { TextBox };
