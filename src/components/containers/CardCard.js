import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { capitalizeFirstLetter } from '../../util/uppercase';
import { CachedImage } from 'react-native-cached-image';

class CardCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardImg: require('../../../assets/icons/blank_card.png'),
      cardType: props.cardType,
      loading: false,
      fetching: false,
    }
  }

  componentDidMount() {
    this.fixImg(this.state.cardType);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cardType) {
      this.fixImg(nextProps.cardType)
    }
  }

  fixImg(cardType) {
    switch (cardType.toLowerCase()) {
      case 'visa':
        this.setState({ cardImg: require('../../../assets/icons/visa.png'), fetching: false})
        break;
      case 'mastercard':
        this.setState({ cardImg: require('../../../assets/icons/mastercard.png'), fetching: false})
        break;
      case 'american_express':
        this.setState({ cardImg: require('../../../assets/icons/amex.png'), fetching: false})
        break;
      case 'discover':
        this.setState({ cardImg: require('../../../assets/icons/discover.png'), fetching: false})
        break;
      case '':
      this.setState({ cardImg: require('../../../assets/icons/blank_card.png'), fetching: false })
      default:
        this.setState({ cardImg: require('../../../assets/icons/blank_card.png'), fetching: false })
    }
  }

  renderIcon() {
    const { fetching, cardImg } = this.state
    if (!fetching){
      return (
        <CachedImage
          source={cardImg}
          style={styles.cardImg}
        />
      )
    }
  }

  render() {
    const { cardType, last4, pressed } = this.props;
    _cardType = capitalizeFirstLetter(cardType);
    return (
      <TouchableWithoutFeedback onPress={pressed}>
        <View style={styles.card}>
          {this.renderIcon()}
          <Text style={styles.cardText}>{_cardType? _cardType: 'Tap to update'}</Text>
          <Text style={styles.cardText}>{last4}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = ScaledSheet.create({
  cardImg: {
    width: '37@ms',
    height: '37@ms',
    marginBottom: '10@ms',
    marginLeft: '2@ms',
  },
  card: {
    marginLeft: '20@ms',
    borderBottomWidth: '3@ms',
    borderColor: '#878787',
    marginRight: '20@ms',
    flexDirection: 'row',
    marginTop: '20@ms',
  },
  cardText: {
    fontFamily: 'Raleway-Medium',
    fontSize: '23@ms',
    color: 'dimgrey',
    marginLeft: '20@ms',
    marginRight: '20@ms',
    marginBottom: '10@ms',
    alignSelf: 'center',
  },
})

export { CardCard };
