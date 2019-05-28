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
} from 'react-native';
import React, { Component } from 'react';
import { CardCard, PriceField } from '../containers';
import { SignupSection } from '../common';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import VPStatusBar from './VPStatusBar';
import { CachedImage } from 'react-native-cached-image';

class CheckoutModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      totalAmount: '',
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  makePayment(total) {
    const amount = total.toFixed(2);
    const credits = this.props.credits;
    const price = this.props.price;
    const type = this.props.type;

    this.props.makePayment(amount, credits, price, type);
    this.toggleVisible();
    console.log('payment...')
  }

  changePayment() {
    if (this.props.last4 != '' && this.props.last4 != '1234') {
      this.toggleVisible()
      Actions.paymentOptions();
    }
  }

  render() {
    const { modal, container, header } = styles;
    const { price, credits, period, type, discount } = this.props;

    let subtotal = Number(price);
    subtotal = subtotal * discount;
    const total = subtotal + (subtotal * 0.082);
    const totalAmount = total * 100;

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
            <TouchableOpacity style={styles.xContainer} onPress={this.toggleVisible.bind(this)}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>
            <ScrollView style={{flex: 1}}>
              <Text style={header}>Review Details</Text>

              <View style={styles.set}>
                <View style={styles.detailsContainer}>
                  <Text style={styles.setText}>{credits} Lesson Credit(s), <Text style={styles.bold}>{`(${type})`}</Text> purchase</Text>
                  <Text style={styles.setText}>To be used for booking and scheduling lessons.</Text>
                </View>
              </View>

              <Text style={header}>Review Payment</Text>

              <View style={styles.set}>
                <PriceField title="Subtotal" price={'$' + price + '.00'}/>
                <PriceField title={`Discount (${Math.abs(discount * 100 - 100)}%)`} price={((price * (discount * 100 - 100)) /100).toFixed(2)}/>
                <PriceField title="Tax (8.2%)" price={'$' + (subtotal * .082).toFixed(2)}/>
              </View>

              <View style={styles.set}>
                <PriceField title="Total" price={'$' + total.toFixed(2)}/>
              </View>

              <TouchableOpacity onPress={() => this.changePayment()} style={styles.paymentInfo}>
              <SignupSection>
                  <CardCard
                    cardType={this.props.cardType}
                    last4={this.props.last4}
                    pressed={() => this.changePayment()}
                  />
                </SignupSection>
                <Text style={styles.green}>Change Payment Method</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.makePayment(total)}
                style={styles.paymentInfo}
              >
                <Text style={styles.paymentText}>Make Payment</Text>
              </TouchableOpacity>
            </ScrollView>
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
    width: '50@ms',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
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
  bold: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Bold',
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
  detailsContainer: {
    marginRight: '10@ms',
    marginTop: '10@ms',
    marginBottom: '10@ms',
  },
  green: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    margin: '10@ms',
    textAlign:'center',
  },
  paymentInfo: {
    margin: '10@ms',
  },
  paymentText: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '24@ms',
    alignSelf: 'center',
  },
})

export { CheckoutModal };
