import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from  'react-native';
import { CachedImage } from 'react-native-cached-image';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import VPStatusBar from './VPStatusBar';
import { ReviewCard, EmptyCard } from '../containers';

class ReviewsModal extends Component {
  toggleReviews() {
    this.props.closeModal()
  }

  renderReviews() {
      console.log('reviews: ', this.props.reviews)
      if (this.props.reviews.length > 0) {
        return (
          <ScrollView style={styles.reviewsContainer}>
            <FlatList
              data={this.props.reviews}
              renderItem={( {item} ) => (
                <ReviewCard
                  rating={item.rating}
                  title={item.title}
                  review={item.review}
                  submittedBy={item.submittedBy}
                  submitted={item.submitted}
                />
              )}
              keyExtractor={(item) => item.review}
            />
          </ScrollView>
        )
      } else {
        return (
          <EmptyCard text="This mentor doesn't have any reviews yet."/>
        )
      }
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
      >
        <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={styles.modal}>
          <View style={styles.headers}>
            <TouchableOpacity style={styles.xContainer} onPress={this.toggleReviews.bind(this)}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>
            <Text style={styles.header}>Ratings</Text>
          </View>
            {this.renderReviews()}
        </View>
      </Modal>
    )
  }
}

const styles = ScaledSheet.create({
  modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  xContainer: {
    margin: '10@ms',
    width: '50@ms',
    alignSelf: 'center',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
  },
  reviewsContainer: {
    flex: 1,
    marginLeft: '10@ms',
    marginRight: '10@ms',
  },
  header: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: '30@ms',
    color: 'dimgrey',
    fontFamily: 'Raleway-SemiBold',
    marginLeft: '50@s',
  },
  headers: {
    flexDirection: 'row',
  },
})

export { ReviewsModal };
