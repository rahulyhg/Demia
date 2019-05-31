import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
 ScaledSheet,
} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

class ChatInput extends Component {

  sendMessage = () => {
    this.props.onSendMsg()
    this.textInput.clear()
  }

  render() {
    let icon = this.props.text === ""? require('../../../assets/icons/greySend.png') : require('../../../assets/icons/greenSend.png');
    return (
      <View style={styles.container}>
        <TextInput
          ref={input => { this.textInput = input }}
          contextMenuHidden
          multiline
          style={styles.input}
          onChangeText={(text) => this.props.onType({text})}
          value={this.props.text.text}
          placeholder="Enter message"
          placeholderTextColor="dimgrey"

        />
        <TouchableOpacity onPress={this.sendMessage} style={{justifyContent: 'flex-end'}}>
          <FastImage
            source={icon}
            style={styles.mediaIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: '20@ms',
    borderWidth: '1@ms',
    borderColor: 'dimgrey',
    margin: '5@ms',
    paddingLeft: '10@ms',
    padding: '4@ms',
    marginBottom: '10@ms',
  },
  input: {
    flex: 1,
    fontSize: '20@ms',
    marginRight: '10@ms'
  },
  inputText: {

  },
  mediaIcon: {
    width: '34@ms',
    height: '34@ms',
    alignSelf: 'flex-end',
    marginRight: '5@ms',
  },
})

export { ChatInput }
