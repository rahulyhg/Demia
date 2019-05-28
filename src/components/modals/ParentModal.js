import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';
import {
  ScaledSheet,
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { TimeSlotCard } from '../containers';
import RatingModal from './RatingModal';
import Communications from 'react-native-communications';
import { formatPhoneNumber, unformatPhoneNumber } from '../../util/phone';
var _ = require('lodash');

class ParentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coach: {},
      visible: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible ) {
      this.setState({ visible: nextProps.visible });
    }
  }

  closeModal() {
    this.props.close();
    this.setState({ visible: false})
  }

  toThreads = () => {
    console.log('nav to threads')
    let threadId = this.props.parent.id
    let user = this.props.parent.user
    let mentor = this.props.parent.mentor
    this.closeModal()
    setTimeout(() => Actions.mentorMessageThread({ threadId: threadId, user: user, mentor: mentor }), 100)
  }

  render() {
    const { pressed, visible, parent } = this.props
    var phone = formatPhoneNumber(parent.user.phone)

    return (
      <Modal
        visible={this.state.visible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
          <View style={styles.containerStore}>
            <View style={styles.container}>

              <Text style={styles.name}>{parent.user.name}</Text>

              <TouchableOpacity
                onPress={this.toThreads}
                style={styles.contactContainer}
              >
                <Text style={styles.contact}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Communications.text(parent.user.phone)}
                style={styles.contactContainer}
              >
                <Text style={styles.contact}>Text: {phone}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = ScaledSheet.create({
  name: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  contact: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '18@s',
    paddingLeft: '20@s',
    alignSelf: 'center',
    paddingRight: '10@s',
  },
  contactContainer: {
    height: '40@vs',
    alignSelf: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginLeft: '15@s',
    marginRight: '15@s',
    marginTop: '10@vs',
  },
  containerStore: {
    backgroundColor: '#rgba(178, 178, 178, 0.5)',
    justifyContent: 'flex-start',
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    marginTop: '150@vs',
    marginLeft: '15@s',
    marginRight: '15@s',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
  },
  slotContainer: {
    borderRightWidth: '2@s',
    borderLeftWidth: '2@s',
    borderColor: '#989898',
    marginLeft: '30@ms',
    marginRight: '30@ms',
  },
  availibility: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
    fontSize: '17@ms',
    marginBottom: '5@ms',
  }
})

export { ParentModal }
