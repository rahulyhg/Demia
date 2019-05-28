import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { TextLine } from '../containers';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import StarRating from 'react-native-star-rating';
import { CachedImage } from 'react-native-cached-image';
import VPStatusBar from './VPStatusBar';
import moment from 'moment';

//used in
class RatingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: 0,
      title: '',
      review: '',
    }
  }

  submitRating() {
    var submitter = this.props.user.name.split(' ');

    const stars = this.state.stars;
    const title = this.state.title;
    const review = this.state.review;
    const submitted = moment().format('MMMM Do YYYY');
    const submittedBy = submitter[0];

    const rating = {
      stars,
      title,
      review,
      submitted,
      submittedBy,
    }

    this.props.submit(rating)
    this.toggleVisible()
  }

  changeRating(rating) {
    this.setState({stars: rating})
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
      <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={styles.modal}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.xContainer} onPress={this.toggleVisible.bind(this)}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>

            <KeyboardAvoidingView behavior="position" >

            <Text style={styles.header}>Rate the practice</Text>

            <View style={styles.picContainer}>
              <CachedImage
                source={{uri: this.props.pic}}
                style={styles.pic}
              />
            </View>

            <View style={styles.stars}>
              <StarRating
                disabled={false}
                maxStars={5}
                emptyStar={require('../../../assets/icons/emptyStar.png')}
                fullStar={require('../../../assets/icons/star.png')}
                halfStar={require('../../../assets/icons/halfStar.png')}
                starSize={40}
                rating={this.state.stars}
                selectedStar={(rating) => this.changeRating(rating)}
              />
            </View>

            <View style={styles.textBox}>
              <TextLine
                placeholder="Title"
                typed={(text) => this.setState({title: text})}
                inputStyle={styles.titleTextLine}
              />
            </View>

            <View style={styles.textBox}>
              <TextLine
                placeholder="Review"
                typed={(text) => this.setState({review: text})}
                inputStyle={styles.reviewTextLine}
                multiline={true}
              />
            </View>

            <TouchableOpacity onPress={this.submitRating.bind(this)} >
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>

            </KeyboardAvoidingView>

          </View>
        </View>
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    marginLeft: '10@ms',
  },
  xContainer: {
    margin: '10@ms',
    width: '50@ms',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
  },
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    marginLeft: '10@ms',
    alignSelf: 'center',
    textAlign: 'center',
  },
  stars: {
    marginLeft: '50@ms',
    marginRight: '50@ms',
    marginTop: '30@ms',
    marginBottom: '10@ms',
  },
  textBox: {
    margin: '20@ms',
    marginBottom: '10@ms',
  },
  reviewTextLine: {
    height: '80@ms',
    width: '300@s',
  },
  titleTextLine: {
    width: '300@s',
  },
  submitText: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '24@ms',
    alignSelf: 'center',
  },
  pic: {
    width: '70@ms',
    height: '70@ms',
    borderRadius: '35@ms',
    alignSelf: 'center',
  },
  picContainer: {
    justifyContent: 'center',
    marginTop: '30@ms',
    borderWidth: '4@ms',
    borderColor: '#314855',
    borderRadius: '37@ms',
    width: '74@ms',
    height: '74@ms',
    alignSelf: 'center',
  },
})

export { RatingModal };
