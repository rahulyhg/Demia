import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  BackNavBar,
  SignupSection,
  Block,
} from '../common';
import {
  CreditOption,
  SelectCredits,
  SelectSubscription
} from '../containers';
import { connect } from 'react-redux';
import {
  purchaseCredits,
  retrieveCard,
  fetchProfile,
  subscribeUser,
  fetchSubscription,
  createPlan,
} from '../../actions';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { CheckoutModal } from '../modals';
import { CachedImage } from 'react-native-cached-image';

class LessonCredits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      price: '',
      credits: '',
      periods: '',
      alertCount: 0,
      plan_id: '',
      last4: '',
      cardType: '',
      alerted: true,
      type: '',
      discount: '',
      subscription: {
        isActive: false,
        status: 'cancelled',
      },
      user: {
        credits: 0,
      }
    }
  }

  componentDidMount() {
    const role = 'users';
    this.props.retrieveCard(role);
    this.props.fetchProfile();
    this.props.fetchSubscription()
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({ alertCount: this.state.alertCount++})
      if (this.state.alertCount < 1) {
        Alert.alert(nextProps.message);
      }
    }

    if (nextProps.card) {
      this.setState({
        cardType: nextProps.card.cardType,
        last4: nextProps.card.last4,
      })
    }

    if (nextProps.user) {
      this.setState({
        user: nextProps.user,
      })
    }

    if (nextProps.userInfo) {
      this.setState({ user: nextProps.userInfo })
    }

    if (nextProps.subscription) {
      this.setState({
        subscription: nextProps.subscription,
      })
    }

    if (nextProps.messages.length == 2) {
      if (this.state.alerted == false) {
        this.setState({ alerted: true });
        this.alert(nextProps.messages);
      }
    }
  }

  alert(messages) {
    Alert.alert(
      messages[0],
      messages[1],
      [
        {text: 'Ok'}
      ],
      { cancelable: false }
    )
  }

  makePayment(amount, credits, price, type) {
    this.setState({ alerted: false });
    if (type == 'single') {
      console.log('purchase credits')
      this.props.purchaseCredits(credits, amount);
      this.setState({showModal: false, alertCount: 0});
    } else if (type == 'subscription') {
      // console.log('price', amount)
      this.props.createPlan(amount, credits)
      this.setState({showModal: false, alertCount: 0});
    }
  }

  render() {
    return (
      <Block >
        <BackNavBar
          title=""
          titleViewStyle={{marginLeft: scale(-47)}}
        />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.creditContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>You currently have {this.state.user.credits} Credits</Text>
          </View>

          <SelectCredits price={'70'}
            credits={2}
            period="per 2 credits"
            pressed={(price, credits, discount) => this.setState({price, credits, discount, type:"single", showModal: true})}
          />

        </ScrollView>

        <CheckoutModal
          credits={this.state.credits}
          price={this.state.price}
          period={this.state.period}
          visible={this.state.showModal}
          cardType={this.state.cardType}
          last4={this.state.last4}
          type={this.state.type}
          discount={this.state.discount}
          toggleVis={() => this.setState({showModal: false})}
          makePayment={(amount, credits, price, type) => this.makePayment(amount, credits, price, type)}
        />
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  header: {
    margin: '10@ms',
  },
  headerText: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
    marginLeft: '5@ms',
  },
  purchaseView: {
    marginTop: '10@ms',
    justifyContent: 'center',
  },
  creditContainer: {
    marginBottom: '10@vs',
    marginTop: '5@vs',
  },
  navImage: {
    width: '40@s',
    height: '40@s',
    marginTop: '10@vs',
  },
  line: {
    borderColor: '#27a587',
    borderBottomWidth: '2@ms',
    flex: 1,
    marginLeft: '15@ms',
    marginRight: '15@ms',
  },
  subHeaderText: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: '#27a587',
    marginTop: '20@ms',
    textAlign: 'center',
  },
  info: {
    fontFamily: 'Roboto-Regular',
    fontSize: '20@ms',
    color: '#27a587',
    marginTop: '5@ms',
    textAlign: 'center',
  },
})

const mapStateToProps = state => {
  const { loading, message } = state.booking;
  const { card, messages } = state.payment;
  const { user, subscription, } = state.profile;
  const userInfo = user;
  return {
    loading,
    message,
    card,
    userInfo,
    subscription,
    messages,
  }
}

export default connect(mapStateToProps, {purchaseCredits, retrieveCard, fetchProfile, subscribeUser, fetchSubscription, createPlan })(LessonCredits);
