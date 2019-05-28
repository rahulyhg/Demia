import React from 'react';
import {
  View,
  Text,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

const PriceField = ({ title, price }) => {
  return (
    <View>
      <View style={styles.price}>
        <Text style={styles.setText}>{title}</Text>
        <Text style={styles.setText}>{price}</Text>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
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
})

export { PriceField };
