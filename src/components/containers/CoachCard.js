import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  Text,
  View,
  TouchableOpacity,
} from  'react-native';
import { Section } from '../common/Section';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import StarRating from 'react-native-star-rating';
import FastImage from 'react-native-fast-image';


class CoachCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docStatus: require('../../../assets/icons/yellowPending.png')
    }
  }

  renderRating() {
    if (this.props.rating) {
      return (
        <StarRating
          disabled={true}
          maxStars={5}
          emptyStar={require('../../../assets/icons/emptyStar.png')}
          fullStar={require('../../../assets/icons/star.png')}
          halfStar={require('../../../assets/icons/halfStar.png')}
          starSize={20}
          rating={this.props.rating}
          selectedStar={() => {}}
        />
      )
    }
  }

  render() {
    const { containerStyle, imageViewStyle, imageStyle, infoViewStyle, nameStyle, sportStyle, bioStyle, docImgStyle, nameDocContainer } = styles;
    const { name, subject, bio, imgURL, pressed, coach, lesson, uid, rating } = this.props
    let subjects = subject.join(' ')
    const { docStatus } = this.state
    return (
      <TouchableOpacity onPress={() => Actions.profile({coach: coach, lesson: lesson, uid})} style={containerStyle}>
        <Section>

          <View style={imageViewStyle}>
            <View style={styles.imgContainer}>
              <FastImage
                source={{uri: imgURL}}
                style={imageStyle}
              />
            </View>
            {this.renderRating()}
          </View>

          <View style={infoViewStyle}>
            <View style={nameDocContainer}>
            <Text style={nameStyle}>{name}</Text>
            <FastImage source={docStatus} style={docImgStyle}/>
            </View>
            <Text numberOfLines={1} style={sportStyle}>{subject? subjects: ''}</Text>
            <Text numberOfLines={3} style={bioStyle}>{bio}</Text>
          </View>

        </Section>
      </TouchableOpacity>
    );
  }
}

const styles = ScaledSheet.create({
  containerStyle: {
    borderBottomWidth: '2@vs',
    borderColor: '#E6ECEF',
    marginBottom: '20@ms',
  },
  imageViewStyle: {
    justifyContent: 'center',
  },
  imageStyle: {
    width: '84@ms',
    height: '84@ms',
    borderRadius: '42@ms',
    alignSelf: 'center',
  },
  imgContainer: {
    width: '90@ms',
    height: '90@ms',
    borderRadius: '45@ms',
    backgroundColor: 'grey',
    borderWidth: '3@ms',
    borderColor: '#314855',
    justifyContent: 'center',
  },
  infoViewStyle: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: '5@s',
  },
  nameStyle: {
    fontSize: '23@ms',
    color: 'dimgrey',
    fontFamily: 'Avenir',
  },
  sportStyle: {
    fontSize: '22@ms',
    fontFamily: 'Avenir',
    color: '#575757',
    flex: 1,
    marginRight: '5@ms',
  },
  bioStyle: {
    fontSize: '16@ms',
    fontFamily: 'Roboto-Regular',
    marginRight: '5@s',
    color:'#575757',
  },
  docImgStyle: {
    width: '22@ms',
    height: '22@ms',
    alignSelf: 'center',
    marginLeft: '2@ms',
  },
  nameDocContainer: {
    flexDirection: 'row',
  }
});


export { CoachCard };
