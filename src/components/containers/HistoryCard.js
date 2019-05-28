import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';
import { basics } from '../../stylesheet';
import moment from 'moment'

const HistoryCard = ({ name, date, paid }) => {
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.historyCard}>
        <CachedImage
          source={require('../../../assets/icons/greenProfile.png')}
          style={styles.img}
        />

        <View style={{marginRight: moderateScale(20)}}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{moment().utc(date).format("MMM Do YYYY")}</Text>
        </View>

        <View style={styles.costContainer}>
          <Text style={styles.cost}>$15.00</Text>
          <Text style={styles.paid}>{paid == true? 'Paid': ''}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = ScaledSheet.create({
  historyCard: {
    flexDirection: 'row',
    borderBottomWidth: '2@ms',
    borderColor: '#999999',
    marginLeft: '10@ms',
    marginRight: '5@ms',
    paddingTop: '5@ms',
    paddingBottom: '5@ms',
  },
  name: {
    color: '#202020',
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
  },
  date: {
    color: 'dimgrey',
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
  },
  cost: {
    color: 'dimgrey',
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
  },
  img: {
    width: '30@ms',
    height: '30@ms',
    alignSelf: 'center',
  },
  paid: {
    color: '#27a587',
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
    textAlign: 'center',
  },
  costContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
})

export { HistoryCard };
