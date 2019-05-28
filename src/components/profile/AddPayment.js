import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
  Block,
  BackNavBar,
  SignupSection,
  GreenBtn,
} from '../common';
import { connect } from 'react-redux';
import { makePayment, } from '../../actions';
import { AddPaymentModal } from '../modals';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-cached-image';

class AddPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPayment: false,
    };
  }

  togglePayment() {
    this.setState({ showPayment: !this.state.showPayment });
  }

  addMethod(cardInfo) {
    addPaymentMethod(cardInfo);
  }

  renderPayment() {
    if (this.state.showPayment) {
      return (
        <AddPaymentModal
          visible={this.state.showPayment}
          addMethod={this.addMethod.bind(this)}
          onSave={(cardInfo) => this.addMethod(cardInfo)}
        />
      );
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          titleViewStyle={{marginLeft: scale(-47)}}
        />

        <View>
          <Text>Hello AddPayment</Text>
        </View>

        {this.renderPayment()}
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
});

const mapStateToProps = state => {
  const { } = state.profile;
}

export default AddPayment;
