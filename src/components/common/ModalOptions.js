import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { FastImage } from 'react-native-fast-image';


const ModalOptions = ({ onPress, children, imagePath, title, color }) => {
  const { buttonStyle, containerViewStyle, textStlye, imageStyle, textViewStyle, imageViewStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8} style={[containerViewStyle, color]}>
      <View style={[buttonStyle, color]}>
          <View style={textViewStyle}>
            <Text style={textStlye}>
              {title}
            </Text>
          </View>

          <View style={imageViewStyle}>
            <FastImage
              style={imageStyle}
              source={imagePath}
            />
          </View>
        </View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  containerViewStyle: {
    flex: 1,
    height: '50@vs',
    backgroundColor: '#FF814A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: .8,
    marginLeft: '10@s',
    backgroundColor: '#FF814A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStlye: {
    color: '#fff',
    fontSize: '22@ms',
    alignSelf: 'center',
    marginLeft: '50@s',
    fontFamily: 'Roboto-Medium',
  },
  imageStyle: {
    width: '20@s',
    height: '22@vs',
    marginTop: '2@vs',
    marginLeft: '20@s',
    alignSelf: 'flex-end'
  },
  textViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
})

export { ModalOptions };
