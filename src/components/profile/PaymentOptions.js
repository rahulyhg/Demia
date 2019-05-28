import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  Block,
  BackNavBar,
  SignupSection,
  Spinner,
} from '../common';
import { connect } from 'react-redux';
import {
  makePayment,
  retrieveCard,
  fetchPaymentHistory,
  saveUserCard,
} from '../../actions';
import { AddPaymentModal } from '../modals';
import { CardCard, InvoiceCard, } from '../containers';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';


class PaymentOptions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: 'number',
      showPayment: false,
      showHistory: false,
      invoices: this.props.invoices,
      empty: this.props.empty,
      fetching: false,
      alerted: true,
      cardLoading: false
    }
  }

  componentDidMount() {
    this.props.retrieveCard();
    this.props.fetchPaymentHistory();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching) {
      this.setState({ fetching: nextProps.fetching })
    }
    if (nextProps.cardError && !this.state.alerted) {
      Alert.alert(nextProps.cardError)
      this.setState({ alerted: true })
    }
    if (nextProps.cardMsg && !this.state.alerted) {
      Alert.alert(nextProps.cardMsg)
      this.setState({ alerted: true })
    }
  }

  createCutomer() {
    this.props.makePayment();
  }

  toggleHistory() {
    this.setState({ showHistory: !this.state.showHistory });
  }

  togglePayment = () => {
    this.setState({ showPayment: !this.state.showPayment })
  }

  onNewCard = (card) => {
    if (card) {
      this.props.saveUserCard(card)
      this.setState({ alerted: false })
    }
  }

  renderPaymentModal() {
    return (
      <AddPaymentModal 
        visible={this.state.showPayment}
        toggleVis={this.togglePayment}
        onSave={(cardInfo) => this.onNewCard(cardInfo)}
      />
    )
  } 

  renderHistory() {
    if (this.state.showHistory) {
      return (
        <View>
          <FlatList
            data={this.props.invoices}
            extraData={this.props}
            renderItem={({item}) =>
                <InvoiceCard
                  type={item.type}
                  total={item.total}
                  paid_at={item.paid_at}
                />
            }
            keyExtractor={item => item.key}
          />
        </View>
      )
    }
  }

  renderEmpty() {
    if (this.state.empty && this.state.showHistory) {
      return (
        <View>
          <Text style={styles.paymentText}>No Payments</Text>
        </View>
      );
    }
  }

  renderNavBar() {
    return (
      <BackNavBar
        titleViewStyle={{marginLeft: scale(-47)}}
      />
    )
  }

  renderCard() {
    if (this.state.cardLoading) {
      return <Spinner />
    }

    return (
      <SignupSection>
        <CardCard
          cardType={this.props.card.cardType}
          last4={this.props.card.last4}
          pressed={this.togglePayment}
          loading={this.state.cardLoading}
        />
      </SignupSection>
    )
  }

  render() {
    return (
      <Block>
        {this.renderNavBar()}

          <View style={styles.header}>
            <Text style={styles.headerText}>Edit your payment methods</Text>
            <Text style={styles.softHeader}>Your confidential information is kept secure.</Text>
          </View>

          {this.renderCard()}

          <TouchableOpacity onPress={this.togglePayment} style={styles.addMethod}>
            <Text style={styles.addText}>Update payment method</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.toggleHistory()} style={styles.addMethod}>
            <Text style={styles.addText}>Payment History</Text>
          </TouchableOpacity>

          <View style={styles.invoiceContainer}>
            {this.renderHistory()}
            {this.renderEmpty()}
          </View>

          {this.renderPaymentModal()}
      </Block>
    )
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
  softHeader: {
    marginLeft: "5@ms",
    color: "dimgrey",
    fontSize: '23@ms',
    fontFamily: 'Montserrat-Medium',
  },
  card: {
    marginLeft: '10@ms',
    borderBottomWidth: '2@ms',
    borderColor: '#878787',
    marginRight: '10@ms',
    flexDirection: 'row',
    marginTop: '20@ms',
  },
  addMethod: {
    marginTop: '10@ms',
  },
  addText: {
    fontFamily: 'Raleway-Bold',
    fontSize: '23@ms',
    color: '#314855',
    marginRight: '18@ms',
    alignSelf: 'center',
  },
  invoiceContainer: {
    flex: 1,
  },
  paymentText: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: '21@ms',
    color: 'dimgrey',
    marginRight: '18@ms',
    textAlign: 'center',
    margin: '10@ms',
  },
})

const mapStateToProps = state => {
  const { loading } = state.booking;
  const { card, invoiceData, fetching, cardError} = state.payment;
  const { empty, invoices, } = invoiceData;

  return {
    loading,
    fetching,
    card,
    empty,
    invoices,
    cardError,
  }
}

export default connect(mapStateToProps, {makePayment, retrieveCard, saveUserCard, fetchPaymentHistory})(PaymentOptions);
