import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
import {
  ScaledSheet,
  scale,
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

const AthleteCard = ({ onPress, athlete, coach, sport }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <CachedImage
          style={styles.image}
          source={require('../../../assets/icons/greyRunning.png')}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.athlete}>{athlete}</Text>
        <Text style={styles.coach}>Recent mentor: {coach}</Text>
        <Text style={styles.sport}>Recent activity: {sport}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  card: {
    borderColor: 'lightgrey',
    borderBottomWidth: verticalScale(2),
    flexDirection: 'row',
  },
  infoContainer: {
    marginLeft: scale(10),
    marginBottom: verticalScale(3),
    flex: 1,
  },
  athlete: {
    color: '#393939',
    fontFamily: 'Montserrat-Regular',
    fontSize: moderateScale(22),
  },
  coach: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Regular',
    fontSize: moderateScale(17),
  },
  sport: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Regular',
    fontSize: moderateScale(17),
  },
  image: {
    height: '30@ms',
    width: '30@ms',
    marginLeft: '7@ms',
    marginRight: '7@ms',
  },
  imageContainer: {
    justifyContent: 'center',
  }
});

export  { AthleteCard };
