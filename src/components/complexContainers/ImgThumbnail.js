import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image'

const ImgThumbnail = ({ imgUrl, pressed }) => {
  if (imgUrl) {
    return (
      <TouchableWithoutFeedback onPress={pressed} style={styles.container}>
        <View>
          <FastImage
            source={{ uri: imgUrl }}
            style={styles.thumbnail}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: '50@ms',
    height: '50@ms',
    margin: '10@ms',
    alignSelf: 'center',
  },
  filler: {
    width: '40@ms',
    height: '40@ms',
  }
})

export { ImgThumbnail };
