import React, { Component } from 'react';
import {
  connect
} from 'react-redux'
import {
  fetchMessages,
  sendMessageToCoach,
  fetchProfile,
  unsubscribeMessages,
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
      name: 'Joneaux',
      message: '',
      messages: [],
      user: {},
    }
  }

  componentWillMount() {
    let mentor = this.props.mentor
    let user = this.props.user
    console.log(mentor, user)
    this.props.fetchMessages(mentor, user)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages.length != this.state.messages.length) {
      // console.log('messages', nextProps.message)
      this.setState({ messages: nextProps.messages })
    }
  }

  onNewMessage = () => {
    let message = this.state.message
    let user = this.props.user
    let mentor = this.props.mentor
    let thread = mentor.id

    this.props.sendMessageToCoach(thread, message, user, mentor)
    this.setState({ message: '' })
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title={this.props.mentor.name}
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
    let thread = this.props.mentor.id
    this.props.unsubscribeMessages(thread)
  }
}

const mapStateToProps = state => {
  const { empty, messages } = state.message
  const { user } = state.profile

  return {
    empty,
    messages,
    user,
  }
}

export default connect(mapStateToProps, {fetchMessages, sendMessageToCoach, fetchProfile, unsubscribeMessages})(MessageThread);
