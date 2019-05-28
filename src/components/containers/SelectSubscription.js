import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  GreenBtn,
  GrayBtn,
  SignupSection,
} from '../common';
import {Counter} from './Counter';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

class SelectSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      price: 0,
      discount : 1,
    }
  }

  count(count) {
    discount = 1
    if (count >= 4 && count < 8) {
      discount = .95
      return this.setPrice(count, discount)
    } else if (count >= 8 && count < 12) {
      discount = .9
      return this.setPrice(count, discount)
    } else if (count >= 12) {
      discount = .85
      return this.setPrice(count, discount)
    }

    var price = 30.00 * count * discount;
    price = price.toFixed(2)
    this.setState({
      count: count,
      price: price,
      discount: discount,
    })
  }

  onPress() {
    var price = this.state.price
    prices = price.split('.')
    price = prices[0]
    var count = this.state.count
    let discount = this.state.discount

    this.props.pressed(price, count, discount)
  }

  setPrice(count, discount) {
    var price = 30.00 * count * discount;
    price = price.toFixed(2)
    this.setState({
      count: count,
      price: price,
      discount: discount,
    })
  }

  renderBtn() {
    const { pressed } = this.props;
    if (this.state.count == 0) {
      return (
        <SignupSection>
          <GrayBtn onPress={()=> {}}> Select </GrayBtn>
        </SignupSection>
      )
    } else {
      return (
        <SignupSection>
          <GreenBtn onPress={() => this.onPress()}> Select </GreenBtn>
        </SignupSection>
      )
    }
  }

  render() {
    const { price, credits, period, pressed } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.priceText}>${this.state.price}<Text style={styles.headerText}>/month</Text></Text>
          <Text style={styles.headerText}>{this.state.discount * 100 - 100}% discount</Text>
          <View style={{alignSelf: 'center'}}>
            <Counter
              count={0}
              variable=" credits"
              countChanged={(count) => this.count(count)}
              max={20}
            />
          </View>
          <Text style={styles.infoText}>Includes <Text style={styles.credit}>{this.state.count} monthly</Text> lesson Credits</Text>
        </View>

        {this.renderBtn()}

      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginTop: '10@ms',
    backgroundColor: '#fff',
    padding: '10@ms',
    borderRadius: '4@ms',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  priceText: {
    textAlign: 'center',
    fontSize: '40@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
  },
  headerText: {
    textAlign: 'center',
    fontSize: '18@ms',
    fontFamily: 'Roboto-Italic',
  },
  infoText: {
    textAlign: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Regular',
  },
  credit: {
    textAlign: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
  },
})

export { SelectSubscription };
