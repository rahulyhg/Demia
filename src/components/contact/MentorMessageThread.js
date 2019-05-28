import React, { Component } from 'react';
import {
  connect
} from 'react-redux'
import {
  fetchUserMessages,
  sendMessageToUser,
  fetchProfile,
  unsubscribeUserMessages,
} from '../../actions'
import {
  Block,
  BackNavBar,
} from '../common';
import {
  ChatInterface
} from '../complexContainers'
import {
  scale,
} from 'react-native-size-matters';
var _ = require('lodash')

class MessageThread extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: props.messages,
      empty: false,
      thread: this.props.thread,
      name: '',
      message: '',
      messages: [],
      user: {},
    }
  }

  componentWillMount() {
    let thread = this.props.threadId
    this.props.fetchUserMessages(thread)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages.length != this.state.messages.length) {
      this.setState({ messages: nextProps.messages })
    }
  }

  onNewMessage = () => {
    var isNew = false

    let message = this.state.message
    let user = this.props.user
    let mentor = this.props.mentor
    let thread = mentor.id

    this.props.sendMessageToUser(thread, message, user, mentor)
    this.setState({ message: '' })
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title={this.props.user.name}
          titleViewStyle={{marginLeft: scale(-60) }}
        />

        <ChatInterface
          typing={(t) => this.setState({ message: t })}
          sendSMS={this.onNewMessage}
          empty={false}
          messages={this.props.messages}
          text={this.state.message}
        />
      </Block>
    )
  }

  componentWillUnmount() {
    let thread = this.props.threadId
    this.props.unsubscribeUserMessages(thread)
  }
}

const mapStateToProps = state => {
  const { messages } = state.message

  return {
    messages,
  }
}

export default connect(mapStateToProps, {fetchUserMessages, sendMessageToUser, unsubscribeUserMessages})(MessageThread)
