import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';


class ContactItem extends Component{
  render() {
    const { picture, subject, name } = this.props.mentor
    const { img, coachName, contentContainer, container, arrow, info, schedule } = styles;

    return (
      <TouchableOpacity style={container} onPress={this.props.pressed}>
        <View style={contentContainer}>
          <View style={styles.imgContainer}>
            <FastImage
              style={img}
              source={{ uri: picture }}
            />
          </View>
          <View style={info}>
            <Text style={coachName}> {name} </Text>
            <Text style={schedule}> {subject[0]} </Text>
          </View>
        </View>
        <FastImage
          style={arrow}
          source={require('../../../assets/icons/greyContact.png')}
        />
      </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  imgContainer: {
    width: '60@ms',
    height: '60@ms',
    borderRadius: '30@ms',
    marginBottom: '5@vs',
    justifyContent: 'center',
    marginLeft: '10@ms',
  },
  img: {
     width: '60@ms',
     height: '60@ms',
     borderRadius: '30@ms',
     alignSelf: 'center',
  },
  coachName: {
    marginLeft: '10@s',
    fontSize: '22@ms',
    fontFamily: 'Roboto-Regular',
    color: 'dimgrey',
  },
  info: {
    flex: 1,
  },
  schedule: {
    marginLeft: '10@s',
    fontSize: '18@ms',
    fontFamily: 'Roboto-Regular',
    color: 'dimgrey',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10@vs',
    flex: 1,
    borderBottomWidth: '2@vs',
    borderColor: '#E6ECEF',
  },
  arrow: {
    width: '40@s',
    height: '40@vs',
    marginRight: '20@s',
    alignSelf: 'center',
    marginBottom: '10@vs',
  },
});

export { ContactItem };
