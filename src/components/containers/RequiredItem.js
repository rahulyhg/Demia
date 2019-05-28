import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class RequiredItem extends Component {
  renderImg() {
    if (this.props.isRequired) {
      return (
        <CachedImage
          source={require('../../../assets/icons/required.png')}
          style={styles.img}
        />
      )
    }
  }

  render() {
    const { containerStyle, textStyle } = styles;
    const { option, onPress } = this.props
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>
          <Text style={textStyle}>{option}</Text>
          {this.renderImg()}
      </TouchableOpacity>
    );
  }
};

const styles = ScaledSheet.create({
  containerStyle: {
    marginLeft: '10@s',
    marginRight: '10@s',
    marginBottom: '5@vs',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: '23@ms',
    fontFamily: 'Raleway-Regular',
    color: 'dimgrey',
    margin: '8@ms',
    marginBottom: '12@ms',
  },
  img: {
    width: '40@ms',
    height: '40@ms',
    marginBottom: '12@ms',
  }
});

export { RequiredItem };
