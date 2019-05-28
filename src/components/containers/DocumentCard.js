import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet, moderateScale, scale, verticalScale,
} from 'react-native-size-matters';
import { generalStyles, formStyle } from '../../stylesheet';
import { CachedImage } from 'react-native-cached-image';

class DocumentCard extends Component {
  addPhoto() {
    if (this.props.taken) {
      this.props.retake()
    } else {
      this.props.takePicture()
    }
  }

  removeDoc() {
    this.props.removeDoc()
  }

  renderTaken() {
    if (this.props.taken) {
      return (
        <CachedImage
          source={require('../../../assets/icons/greenReviewed.png')}
          style={styles.img}
        />
      )
    } else {
      return (
        <CachedImage
          source={require('../../../assets/icons/greyRightArrow.png')}
          style={styles.img}
        />
      )
    }
  }

  render() {
    const { text, position } = this.props;
    return (
        <TouchableOpacity style={styles.container} onPress={() => this.addPhoto()}>
          <View style={styles.addPhoto}>
            <Text style={styles.info}>{text}</Text>

            {this.renderTaken()}
          </View>
        </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '10@ms',
    marginRight: '15@ms',
    borderBottomWidth: '3@ms',
    borderColor: 'dimgrey',
  },
  addPhoto: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: '5@ms',
  },
  info: {
    fontSize: '20@ms',
    marginLeft: '10@ms',
    color: '#393939',
  },
  img: {
    width: '20@ms',
    height: '20@ms',
    marginRight: '10@ms',
  },
})

export { DocumentCard };
