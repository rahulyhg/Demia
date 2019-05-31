import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {
 ScaledSheet, verticalScale
} from 'react-native-size-matters';
import { ChatInput } from './ChatInput'
import FastImage from 'react-native-fast-image';
import moment from 'moment'
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';

class MessageCard extends Component {
  renderProfilePic() {
    const userUid = firebase.auth().currentUser.uid
    const { from } = this.props.message
    let profileIcon = userUid !== from? require('../../../assets/icons/orangeFox.png') : require('../../../assets/icons/orangeOwl.png')

    if (profileIcon) {
      return (
        <FastImage
          source={profileIcon}
          style={styles.profileImg}
        />
      )
    }
  }

  renderImg() {
    const { imgURL } = this.props.message
    if (imgURL) {
      return (
        <FastImage
          source={imgURL}
          style={styles.msgImg}
        />
      )
    }
  }

  renderTimestamp(item) {
    const { timeSent, isNew, isToday } = item
    let today = moment().format('dddd')
    let msgDate = moment(timeSent).format('dddd')
    let formatteDate = moment(timeSent).format('MMMM Do')
    if (isNew && isToday) {
      return (
        <View style={styles.date}>
          <Text style={styles.dateText}>Today</Text>
        </View>
      )
    } else if (isNew) {
      return (
        <View style={styles.date}>
          <Text style={styles.dateText}>{formatteDate}</Text>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  render() {
    const { text, nameOfSender, timeSent, from } = this.props.message
    const { messageCardContainer, messageInfoContainer, nameStyle, timestampStyle, messageStyle } = styles
    const userUid = firebase.auth().currentUser.uid

    let color = userUid === from? '#FFFBEF':'#FFEBE0'
    return (
      <TouchableOpacity>
        <View>
          {this.renderTimestamp(this.props.message)}
          <View style={[messageCardContainer, {backgroundColor: color }]}>
            <View>
              {this.renderProfilePic()}
            </View>
            <View style={styles.messageContainer}>
              <View>
                <View style={messageInfoContainer}>
                  <Text style={nameStyle}>{nameOfSender}</Text>
                  <Text style={timestampStyle}>{moment(timeSent).format('h:mm a')}</Text>
                </View>

                <Text style={messageStyle}>{text}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


class ChatInterface extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
    }
  }

  componentWillMount() {
    setTimeout(() => this.refs.flatList.scrollToEnd(), 700)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages !== this.state.messages) {
      this.setState({ messages: nextProps.messages })
      this.refs.flatList.scrollToEnd();
    }
  }

  render() {
    if (this.props.empty) {
      return (
        <View style={{flex: 1, justifyContent: 'space-between'}}>

          <Text style={{textAlign: 'center', alignSelf: 'center'}}>Send the first message</Text>

          <KeyboardAwareScrollView contentContainerStyle>
            <ChatInput onSendMsg={() => this.props.sendSMS()} onType={(t) => this.props.typing(t)}/>
          </KeyboardAwareScrollView>

        </View>
      )
    }
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <FlatList
            ref="flatList"
            data={this.props.messages}
            extraData={this.props}
            renderItem={({item}) => (
              <MessageCard message={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <KeyboardAvoidingView keyboardVerticalOffset={verticalScale(80)} behavior="padding">
          <ChatInput text={this.props.text} onSendMsg={() => this.props.sendSMS()} onType={(t) => this.props.typing(t)}/>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  msgImg: {
    width: '50@ms',
    height: '50@ms',
  },
  profileImg: {
    width: '35@ms',
    height: '35@ms',
    alignSelf: 'center',
  },
  messageCardContainer: {
    padding: '4@ms',
    paddingLeft: '6@ms',
    marginLeft: '5@ms',
    marginRight: '10@ms',
    flexDirection: 'row',
  },
  messageContainer: {
  },
  messageInfoContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  timestampStyle: {
    color: 'dimgrey',
    fontSize: '17@ms',
  },
  nameStyle: {
    fontFamily: 'Raleway-Bold',
    fontSize: '20@ms',
    marginRight: '6@ms',
  },
  messageStyle: {
    flex: 1,
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
    paddingRight: '10@ms',
    marginRight: '20@ms',
  },
  date: {
    flex: 1,
  },
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: '18@ms',
    color: 'dimgrey',
    textAlign: 'center',
  },
})

export { ChatInterface }
