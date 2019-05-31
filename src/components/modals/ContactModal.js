import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { TimeSlotCard } from '../containers';
import Communications from 'react-native-communications';
import { formatPhoneNumber } from '../../util/phone';
var _ = require('lodash');
import FastImage from 'react-native-fast-image';
import firebase from 'react-native-firebase';
import VPStatusBar from './VPStatusBar';

class ContactModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      availibility: [],
      coach: {},
      visible: false,
      empty: true,
      count: 0,
    }
  }

  componentDidMount() {
    const uid = this.props.coach.id
    this.fetchCoach(uid)
  }

  fetchCoach(uid) { // (change: move to actions)
    firebase.firestore().collection('coaches').doc(uid)
    .get().then((doc) => {
      console.log(doc.data())
      const availability = doc.data().availibility? doc.data().availibility : [];
      this.setState({ coach: doc.data() })
      this.sortAvail(availability);
    }).catch((err) => {
      console.log(err)
      this.setState({ coach: false });
    })
  }

  sortAvail(availability) {
    if (!_.isEmpty(availability)) {
      var avail = []
      _.forEach(availability, (day) => {
        avail.push(day)
      })
      this.setState({ availability: avail, empty: false })
    } else {
      this.setState({ empty: true })
    }
  }

  onRate() {
    this.closeModal();
    this.props.onRating();
  }

  messagePressed = () => {
    this.closeModal();
    Actions.messageThread({
      mentor: this.props.coach.mentor,
      user: this.props.coach.user
    })

  }

  renderAvailability() {
    if (!this.state.empty) {
      return (
        <View style={styles.slotContainer}>
          <Text style={styles.availibility}>Availability</Text>
          <FlatList
            horizontal
            data={this.state.availability}
            extraData={this.state}
            renderItem={({ item }) => (
              <TimeSlotCard
                day={item.day}
                morning={item.morning}
                afternoon={item.afternoon}
                evening={item.evening}
              />
            )}
            keyExtractor={ item => item.day}
          />
        </View>
      );
    }
  }

  toProfile() {
    const coach = this.props.coach.mentor;
    const uid = this.props.coach.id;
    if (coach && uid) {
      this.closeModal()
      Actions.profile({ coach, uid })
    }
  }

  toReport() {
    this.closeModal()
    this.props.toggleReport()
  }

  toBlock() {
    this.closeModal()
    setTimeout(() => this.props.blockUser(), 100)
  }

  toRemove() {
    const mentorId = this.props.coach.id
    this.closeModal()
    this.props.removeMentor(mentorId) 
  }

  closeModal() {
    this.props.close()
    this.setState({ visible: false})
  }

  render() { //(change: we could def dry this up)
    const { coach } = this.props;
    var phone = formatPhoneNumber(coach.coachPhone)
    var guardianPhone = coach.mentor.guardianPhone? coach.mentor.guardianPhone.replace(/\D/g,''): 'not listed'
    
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
      <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={styles.containerStore}>
          <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.xContainer} onPress={() => this.closeModal()}>
              <FastImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => this.toProfile()}>
              <View>
                <FastImage
                  style={styles.image}
                  source={{ uri: coach.mentor.picture }}
                />

                <Text style={styles.name}>{coach.mentor.name}</Text>
              </View>
            </TouchableWithoutFeedback>
              {this.renderAvailability()}

              <TouchableOpacity
                onPress={() => this.messagePressed()}
                style={styles.contactContainer}
              >
                <Text style={styles.contact}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Communications.text(guardianPhone)}
                style={styles.contactContainer}
              >
                <Text style={styles.contact}>Guardian: {coach.mentor.guardianPhone? coach.mentor.guardianPhone: 'N/A'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onRate()}
                style={styles.contactContainer}
              >
                <Text style={styles.contact}>Rate/Review</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.toReport()}
                style={styles.contactContainer}
              >
                <Text style={styles.report}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.toBlock()}
                style={styles.contactContainer}
              >
                <Text style={styles.report}>Block</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.toRemove()}
                style={styles.contactContainer}
              >
                <Text style={styles.report}>Remove Mentor</Text>
              </TouchableOpacity>

          </ScrollView>
        </View>
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
    alignSelf: 'center',
  },
  contactContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginLeft: '15@s',
    marginRight: '15@s',
    marginTop: '10@vs',
    marginBottom: '10@ms',
  },
  containerStore: {
    backgroundColor: '#rgba(178, 178, 178, 0.5)',
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  image: {
    width: '80@ms',
    height: '80@ms',
    alignSelf: 'center',
    backgroundColor: 'dimgrey',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    borderRadius: '40@ms',
  },
  slotContainer: {
    alignItems: 'center',
  },
  availibility: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: '22@ms',
    marginBottom: '5@ms',
    color: 'dimgrey',
  },
  xContainer: {
    margin: '10@ms',
    width: '50@ms',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
  },
  report: {
    color: '#EA4900',
    fontFamily: 'Montserrat-Medium',
    fontSize: '18@s',
    alignSelf: 'center',
  },
})

export { ContactModal };