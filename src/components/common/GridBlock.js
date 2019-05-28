import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-cached-image';


const GridBlock = ({ children, style, imagePath, title, onPress, iconPath }) => {
  const { image, view, text, textContainer } = styles;
  return (
      <TouchableOpacity style={view} onPress={onPress}>
        <FastImage style={image} source={iconPath}
        />
        <View style={textContainer}>
          <Text style={text}>{title}</Text>
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 30,
    flex: .5,
  },
  view: {
    width: 172,
    height: 150,
    backgroundColor: '#fff',
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'space-between',
    borderWidth: 3,
    borderRadius: 6,
    borderColor: '#f47d5d',
    shadowColor: '#7a7f7d',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    elevation: 4,
  },
  text: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
    color: '#423D3C',
  },
  textContainer: {
    backgroundColor: '#FFFAFA',
    flex: .34,
    justifyContent: 'center',
  }
});

export { GridBlock };
