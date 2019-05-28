import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import firebase from 'react-native-firebase';

class DefaultMethodCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bankColor: 'dimgrey',
      cardColor: '#EA4900',
      bankSelected: false,
      cardSelected: true,
      selected: '',
      card: {
        payout_methods: []
      },
    }
  }

  componentDidMount() {
    console.log(this.props.card.payment_method)
    this.fetchMethod()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected == 'debit_card') {
      this.setState({ bankSelected: false, cardSelected: true })
    }
    if (nextProps.selected == 'bank_routing') {
      this.setState({ bankSelected: true, cardSelected: false })
    }
    if (nextProps.card !== this.state.card) {
      this.setState({ card: nextProps.card })
    }
  }

  fetchMethod = () => {
    const user = firebase.auth().currentUser

    try {
      firebase.firestore().collection('coaches').doc(user.uid)
        .get().then((doc) => {
          const { defaultMethod } = doc.data()
          if (defaultMethod == 'debit_card') {
            return this.setState({ bankSelected: false, cardSelected: true })
          }
          if (defaultMethod == 'bank_routing') {
            return this.setState({ bankSelected: true, cardSelected: false })
          }
        })
    } catch(err) {
      console.log('err', err)
    }
  }

  onBankSelected = () => {
    if (this.state.bankSelected) {
      return;
    }
    this.setState({
      bankSelected: !this.state.bankSelected,
      cardSelected: !this.state.cardSelected,
    })
    this.props.bankSelected()
  }

  onCardSelected = () => {
    if (this.state.cardSelected) {
      return;
    }
    this.setState({
      bankSelected: !this.state.bankSelected,
      cardSelected: !this.state.cardSelected,
    })
    this.props.cardSelected()
  }

  render() {
    var bankColor = this.state.bankSelected? '#EA4900':'dimgrey'
    var cardColor = this.state.cardSelected? '#EA4900':'dimgrey'
    let method = '2-3 business days'
    if (this.state.card) {
      if (this.state.card.payout_methods.includes('instant')) {
        method = 'Instant (minutes)'
      }
    }

    return (
      <View>
        <Text style={styles.header}>Default Payout Method</Text>

        <View style={styles.container}>
          <TouchableOpacity onPress={this.onBankSelected} style={[styles.cardStyle, {borderColor: bankColor}]}>
            <Text style={[styles.title, {color: bankColor}]}>Bank Account</Text>
            <Text style={styles.subTitle}> 2-3 business days</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onCardSelected} style={[styles.cardStyle, {borderColor: cardColor}]}>
            <Text style={[styles.title, {color: cardColor}]}>Debit Card</Text>
            <Text style={styles.subTitle}>{method}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  componentWillUnmount() {
    // const user = firebase.auth().currentUser
    // var unsubscribe = firebase.firestore().collection('coaches').doc(user.uid)
    //   .onSnapshot(function () {});
    //
    // unsubscribe();
  }
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: '10@ms',
    paddingRight: '10@ms',
    margin: '5@ms',
  },
  header: {
    fontFamily: 'Roboto-Medium',
    color: 'dimgrey',
    fontSize: '22@ms',
    textAlign: 'center',
    marginTop: '20@ms',
  },
  cardStyle: {
    justifyContent: 'center',
    flex: 1,
    borderRadius: '7@ms',
    borderWidth: '2@ms',
    borderColor: 'dimgrey',
    height: '50@ms',
    margin: '5@ms',
  },
  title: {
    fontFamily: 'Roboto-Regular',
    color: 'dimgrey',
    fontSize: '19@ms',
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    color: 'dimgrey',
  },
})

export { DefaultMethodCard };
