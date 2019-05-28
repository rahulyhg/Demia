import React, { Component } from 'react';
import {
  View,
  TextInput,
  Keyboard
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

class TextLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      placeholder: props.placeholder,
      secure: props.secure,
      keyboardType: props.keyboardType,
      maxLength: props.maxLength,
      multiline: props.multiline,
      nol: props.nol,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text) {
      this.setState({ text: nextProps.text })
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
    const { inputStyle, containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={[styles.input, inputStyle]}
          onChangeText={(text) => this.sendData(text)}
          value={this.state.text}
          placeholder={this.state.placeholder}
          returnKeyType="done"
          autoCapitalize="sentences"
          secureTextEntry={this.state.secure}
          keyboardType={this.state.keyboardType}
          maxLength={this.state.maxLength}
          multiline={this.state.multiline}
          numberOfLines={this.state.nol}
        />
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  input: {
    width: '150@ms',
    height: '30@ms',
    fontFamily: 'Montserrat-Regular',
    fontSize: '23@ms',
  },
  container: {
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '30@ms',
    borderBottomWidth: '2@ms',
    borderColor: '#989898',
    justifyContent: 'center',
  },
})

export { TextLine };