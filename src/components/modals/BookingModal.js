import {
  Modal,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import { CardCard } from '../containers';
import { Actions } from 'react-native-router-flux';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import VPStatusBar from './VPStatusBar';
import { CachedImage } from 'react-native-cached-image';

class BookingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      afterCredits: 0,
      last4: '1234',
      cardType: 'visa',
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  changeMethod = () => {
    Actions.paymentOptions()
  }

  makeBooking() {
    const credits = Number(this.props.credits)
    const cost = Number(this.props.cost)
    const afterCredits = credits - cost

    this.props.book(afterCredits);
  }

  purchaseCredits() {
    this.toggleVisible()
    Actions.lessonCredits()
  }

  render() {
    const { credits, price, cost, coach, } = this.props;
    const { modal, container, header } = styles;
    var _cost = Number(cost);
    const after = credits - cost;

    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>
        <View style={modal}>
          <View style={container}>
            <View style={styles.xContainer}>
              <TouchableOpacity onPress={() => this.toggleVisible()}>
                <CachedImage
                  source={require('../../../assets/icons/x.png')}
                  style={styles.xImg}
                />
              </TouchableOpacity>

              <CachedImage
                source={{uri: this.props.mentorPic}}
                style={styles.mentorPic}
              />
            </View>

            <Text style={header}>Review Details</Text>

            <View style={styles.set}>
              <View style={styles.price}>
                <Text style={styles.setText}>1 Hour session with {coach}. </Text>
              </View>
            </View>

            <Text style={header}>Review Payment</Text>

            <View>
              <View style={styles.cardContainer}>
                <CardCard
                  cardType={this.props.card.cardType}
                  last4={this.props.card.last4}
                  pressed={this.changeMethod}
                />
              </View>
            </View>

            <View style={[styles.set, {borderBottomWidth: 0}]}>
              <View style={styles.price}>
                <Text style={styles.setText}>1-Hour Tutoring Session</Text>
                <Text style={styles.setText}>${this.props.price}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.makeBooking()}
              style={styles.paymentInfo}
            >
              <Text style={styles.paymentText}>Book</Text>
            </TouchableOpacity>
            <View style={{alignSelf: 'center'}}>
              <Text style={styles.setText}>{coach}</Text>
            </View>

          </View>
        </View>
      </Modal>
    )
  }
}

const styles = ScaledSheet.create({
  modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    marginLeft: '10@ms',
  },
  xContainer: {
    margin: '10@ms',
    width: '190@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xImg: {
    width: '37@ms',
    height: '37@ms',
  },
  set: {
    margin: '10@ms',
    borderBottomWidth: '2@ms',
    borderColor: '#989898',
  },
  setText: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    marginBottom: '5@ms',
    marginLeft: '10@ms',
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '10@ms',
    marginTop: '10@ms',
    marginBottom: '10@ms',
  },
  green: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
    color: '#27a587',
  },
  paymentInfo: {
    margin: '10@ms',
    marginTop: '140@ms',
    justifyContent: 'center',
  },
  paymentText: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '24@ms',
    alignSelf: 'center',
    textAlign: 'center',
  },
  mentorPic: {
    width: '70@ms',
    height: '70@ms',
    // alignSelf: 'center',
    borderRadius: '35@ms',
  },
  cardContainer: {
    padding: '3@ms',
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  sessionPrice: {
    fontSize: '25@ms',
    color: 'dimgrey',
  },
})

export { BookingModal };
