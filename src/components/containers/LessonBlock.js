import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from  'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const LessonBlock = ({ numOfLessons, price, coach, pressed }) => {
  const { topSetStyle, bookStyle, priceTextStyle, lessonTextStyle, containerStyle, bookTextStyle, priceContainer, lessonSetStyle } = styles;
  return (
    <TouchableOpacity onPress={pressed}>
      <View style={containerStyle}>

        <View style={topSetStyle}>
          <View style={lessonSetStyle}>
            <Text style={lessonTextStyle}>{numOfLessons} Hour Session</Text>
          </View>
          <View style={priceContainer}>
            <Text style={priceTextStyle}>{price}</Text>
          </View>
        </View>

        <View style={bookStyle}>
          <Text style={bookTextStyle}>Book {coach}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  topSetStyle: {
    flexDirection: 'row',
  },
  priceTextStyle: {
    fontSize: '20@s',
    color: '#314855',
    fontFamily: 'Atletico Medium',
    marginLeft: '5@ms',
    textAlign: 'center',
  },
  priceContainer: {
    flex: 1,
    borderLeftWidth: '3@s',
    borderColor: '#314855',
    justifyContent: 'center',
  },
  bookStyle: {
    borderTopWidth: '3@vs',
    borderColor: '#314855',
    justifyContent: 'center',
  },
  bookTextStyle: {
    fontFamily: 'Atletico Medium',
    fontSize: '20@ms',
    color: '#314855',
    textAlign: 'center',
    marginTop: '4@ms',
  },
  lessonSetStyle: {
    marginRight: '10@s',
    justifyContent: 'center',
  },
  lessonTextStyle: {
    fontSize: '18@ms',
    fontWeight: '600',
    color: '#314855',
    fontFamily: 'Atletico Medium',
    fontWeight: '700',
    marginLeft: '5@s',
  },
  containerStyle: {
    borderColor: '#314855',
    backgroundColor: '#FFFBEF',
    borderWidth: '3@ms',
    alignSelf: 'center',
    marginBottom: '10@vs',
    marginTop: '10@vs',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
    paddingLeft: '10@ms',
    paddingRight: '10@ms',
    paddingTop: '5@ms',
    width: '260@ms',
    borderRadius: '7@ms',
  },
});


export { LessonBlock };
