import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  Block,
  BackNavBar,
  SignupSection,
  GreenBtn,
} from '../common';
import firebase from 'react-native-firebase';
import { CardCard } from '../containers';
import {
  createCutomer,
  subscribeUser,
  addPaymentMethod,
  retrieveCard,
  fetchSubscription,
  suspendSubscription,
} from '../../actions';
import { connect } from 'react-redux';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { capitalizeFirstLetter } from '../../util/uppercase';
import { CachedImage } from 'react-native-cached-image';
import moment from 'moment';

class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription: true,
      alerted: true,
      plan: {
        subscription_amount: '',
        billing_period_unit: '',
        renewal_date: '',
      },
      number: '************4242',
      name: 'John Doe',
      expiry: '0122',
      cvc: '123',
      cardType: 'visa',
      last4: '1234',
      focused: 'number',
      billing_period_unit: '',
      subscription_amount: '',
    };
  }

  componentDidMount() {
    const role = 'users';
    this.props.retrieveCard(role);
    this.props.fetchSubscription();
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.card) {
        this.setState({
          cardType: nextProps.card.cardType,
          last4: nextProps.card.last4,
        })
      }

      if (nextProps.subscription) {
        var {
          status, plan_id, billing_period_unit,
          activated_at, next_billing_at, plan_unit_price,
          id,
        } = nextProps.subscription;

        var isActive = status == 'active'? true:false;

        //turn utc date to readable
        var renewal_date = this.formatDate(next_billing_at);

        plan_unit_price = plan_unit_price / 100

        this.setState({
          subscription: isActive,
          plan: {
            plan_id: plan_id,
            subscription_amount: plan_unit_price,
            renewal_date: renewal_date,
            billing_period_unit: billing_period_unit,
            subscriptionId: id,
          }
        })
      }

      if (nextProps.messages) {
        if (nextProps.messages != "" && this.state.alerted == false) {
          this.setState({ alerted: true });
          Alert.alert(
            nextProps.messages[0],
            nextProps.messages[1],
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false },
          )
        }
      }
  }

  paymentInfo() {
    Actions.paymentOptions();
  }

  suspendSubscription() {
    this.setState({ alerted: false });
    subscriptionId = this.state.plan.subscriptionId;
    this.props.suspendSubscription(subscriptionId);
  }

  formatDate(date) {
    if (date != '' && date != undefined ) {
      const _d = moment.unix(date);
      return moment(_d).format('dddd MMM Do GGGG')
    }
  }

  renderSubscription() {
    const { header, headerText, addText } = styles;
    const { plan } = this.state;
    if (this.state.subscription == true) {
      return (
        <ScrollView>
          <View style={header}>
            <Text style={headerText}>
              ${plan.subscription_amount} / {plan.billing_period_unit}      4 {plan.billing_period_unit}ly credits
              </Text>
            <Text style={headerText}>Renewal Date: {plan.renewal_date}</Text>

            <TouchableOpacity onPress={this.suspendSubscription.bind(this)}>
              <Text style={addText}>Suspend/Cancel Subscription</Text>
            </TouchableOpacity>
          </View>

          <View style={header}>
            <SignupSection>
              <CardCard
                cardType={this.state.cardType}
                last4={this.state.last4}
                pressed={() => console.log('sup')}
              />
            </SignupSection>

            <TouchableOpacity onPress={this.paymentInfo.bind(this)}>
              <Text style={addText}>Change Payment Info</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={header}>
          <Text style={headerText}>No Active Subscriptions</Text>
        </View>
      );
    }
  }

  renderNavBar() {
    return (
      <BackNavBar
        titleViewStyle={{marginLeft: scale(-34)}}
      />
    );
  }

// email, name, cardNumber, cardHolder, cardExpiryM, cardExpiryY, cardCCV, cardZip
  customer() {
    const number = '4242424242424242';
    const name = 'Jonathan Edgar';
    const exp_month = '02';
    const exp_year = '22';
    const cvc = '123';
    const address_zip = '12345';

    var cardInfo = {
      number,
      name,
      exp_month,
      exp_year,
      cvc,
      address_zip,
    }

    this.props.createCutomer(cardInfo);
  }

  subscribe() {
    this.props.subscribeUser();
  }

  renderTestBtn() {
    return (
      <View>
        <TouchableOpacity style={styles.header} onPress={() => this.customer()}>
          <Text style={styles.addText}>Create Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.header} onPress={() => this.subscribe()}>
          <Text style={styles.addText}>Subscribe User</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <Block>

        {this.renderNavBar()}

        <Text style={styles.subHeader}>Your Subscription</Text>

        {this.renderSubscription()}

      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  subHeader: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '36@ms',
    color: 'dimgrey',
    marginLeft: '5@ms',
  },
  header: {
    margin: '10@ms',
    padding: '5@ms',
    borderWidth: '2@ms',
    borderColor: 'dimgrey',
    borderRadius: '5@ms',
  },
  headerText: {
    marginBottom: '5@vs',
    fontFamily: 'Roboto-Medium',
    fontSize: '18@ms',
    textAlign: 'center',
    color: 'dimgrey',
  },
  cardImg: {
    width: '37@ms',
    height: '37@ms',
    marginRight: '20@ms',
    marginBottom: '10@ms',
    marginLeft: '2@ms',
  },
  card: {
    marginLeft: '10@ms',
    borderBottomWidth: '3@ms',
    borderColor: '#878787',
    marginRight: '10@ms',
    flexDirection: 'row',
    marginTop: '20@ms',
  },
  cardText: {
    fontFamily: 'Raleway-Medium',
    fontSize: '23@ms',
    color: 'dimgrey',
    marginRight: '20@ms',
    marginBottom: '10@ms',
    alignSelf: 'center',
  },
  addText: {
    fontFamily: 'Raleway-Medium',
    fontSize: '23@ms',
    color: '#2BA888',
    marginRight: '18@ms',
    alignSelf: 'center',
    marginTop: '8@ms',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const { loading, } = state.booking;
  const { card, messages, } = state.payment;
  const { subscription } = state.profile;

  return {
    loading,
    card,
    subscription,
    messages,
  };
}

export default connect(mapStateToProps, {createCutomer, subscribeUser, addPaymentMethod, retrieveCard, fetchSubscription, suspendSubscription}) (Subscription);
