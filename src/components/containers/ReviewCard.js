import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from  'react-native';
import { CachedImage } from 'react-native-cached-image';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { basics } from '../../stylesheet';
import StarRating from 'react-native-star-rating';

const ReviewCard = ({ rating, title, review, submitted, submittedBy }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.star}>
          <StarRating
            disabled={true}
            maxStars={5}
            emptyStar={require('../../../assets/icons/emptyStar.png')}
            fullStar={require('../../../assets/icons/star.png')}
            halfStar={require('../../../assets/icons/halfStar.png')}
            starSize={15}
            rating={rating}
            selectedStar={() => {}}
          />
        </View>
      </View>

      <Text style={styles.title}>by {submittedBy} - {submitted}</Text>
      <Text style={styles.review}>{review}</Text>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: '2@ms',
    borderColor: '#cccccc',
    marginBottom: '10@ms',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '2@ms',
  },
  title: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Medium',
    fontSize: '19@ms',
    marginRight: '5@s',
  },
  submittedBy: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Medium',
    fontSize: '19@ms',
  },
  review: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '19@ms',
    marginBottom: '7@ms',
    marginTop: '5@ms',
  },
  star: {
    justifyContent: 'center',
  }
})

export { ReviewCard };
