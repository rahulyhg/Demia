import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

const RelationshipCard = ({ title, onPress, imgPath, relationship, children, color }) => {
  return (
    <TouchableOpacity style={[styles.coachContainer, color]} onPressed={onPress}>
        <View>
          <Text style={styles.athleteText}>{title}</Text>
          <View style={styles.imageContainer}>
            {children}
          </View>
          <Text style={styles.athleteText}>{relationship}!</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  athleteContainer: {
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
    backgroundColor: '#cbf7da',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  athleteText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Medium',
    fontSize: '33@ms',
    margin: '10@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  coachContainer: {
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
    backgroundColor: '#fdb964',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})

export { RelationshipCard };
