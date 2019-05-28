import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
var ImagePicker = require('react-native-image-picker');
import RNFetchBlob from 'rn-fetch-blob';
import { CachedImage } from 'react-native-cached-image'

class ImgPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarSource: props.image? {uri: props.image} : require('../../../assets/icons/filler.png'),
      pic: {uri: props.image},
    }
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    const user = firebase.auth().currentUser;
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

  return new Promise((resolve, reject) => {
    console.log('url', uri);
    uri = uri.toString()
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    let uploadBlob = null

    const imageRef = firebase.storage().ref('coach_pics').child(user.uid)

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `image/jpeg;BASE64` })
      }).then((blob) => {
        uploadBlob = blob
        return imageRef.put(uri, { contentType: 'image/jpeg' })
      }).then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      }).then((url) => {
        this.saveProfilePic(url);
        resolve(url)
      }).catch((error) => {
        reject(error)
    })
  })
}

  cropImage() {
    var options = {
      title: 'Take Picture',
      storageOptions: {
        skipBackup: true,
        // path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        return Alert.alert('Please check your camera permisions')
      } else {
        var url = response.uri
        this.props.setAvatar(response.uri)
        this.uploadImage(url)
          .then((url) => {
            saveProfilePic(url)
            console.log('download url:', url)
          }).catch((err) => {
            console.log('error: ')
          })
      }
    })
  }

  saveProfilePic(url) {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('coaches').doc(user.uid)
      .update({
        picture: url,
      }).then(() => {
        console.log('done');
      }).catch((err) => {
        console.log('error: ');
      })
  }

  render() {
    const img = this.props.image != ''? {uri: this.props.image} : require('../../../assets/icons/profile.png');
    return (
      <TouchableWithoutFeedback onPress={() => this.cropImage()}>
        <View style={styles.container}>
          <CachedImage
            source={img}
            style={styles.img}
            resizeMode="cover"
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = ScaledSheet.create({
  img: {
    height: '116@ms',
    width: '116@ms',
    alignSelf: 'center',
    backgroundColor: 'dimgrey',
    borderRadius: '58@ms',
  },
  container: {
    justifyContent: 'center',
    marginBottom: '10@ms',
    height: '120@ms',
    width: '120@ms',
    borderRadius: '60@ms',
    borderColor: '#314855',
    borderWidth: '3@ms',
    alignSelf: 'center',
  },
})

export default ImgPicker;
