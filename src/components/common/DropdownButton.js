import React from 'react';
import { Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaledSheet }  from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';


const DropdownButton = ({ onPress, children, imgURL, style, text }) => {
  const { buttonStyle, containerViewStyle, textStlye, imageStyle, textViewStyle, imageViewStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={[containerViewStyle, style]}>
      <View style={buttonStyle}>
          <View style={textViewStyle}>
            <Text style={[textStlye, text]}>
              {children}
            </Text>
          </View>

          <View style={imageViewStyle}>
            <FastImage
              style={imageStyle}
              source={imgURL}
            />
          </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  containerViewStyle: {
    flex: .8,
    height: '40@vs',
    borderBottomWidth: '2@ms',
    borderColor: 'dimgrey',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2@ms',
  },
  buttonStyle: {
    flex: .8,
    marginLeft: '10@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStlye: {
    color: '#ef5a30',
    fontSize: '22@ms',
    alignSelf: 'center',
    marginLeft: '5@s',
    fontFamily: 'Avenir-Medium',
  },
  imageStyle: {
    width: '30@s',
    height: '30@vs',
    marginTop: '2@vs',
    marginLeft: '30@s',
    alignSelf: 'flex-end',
    marginBottom: '2@ms',
  },
  textViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: '25@s',
  },
})

export { DropdownButton };
