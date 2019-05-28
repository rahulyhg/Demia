import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

const minDate = () => {
  var today = new Date();
  var dayAfterNext = today.add(2).day();
}

class ContactItem extends Component{
  render() {
    const { picture, sport, name } = this.props.mentor
    const { img, coachName, contentContainer, container, arrow, info, schedule } = styles;

    return (
      <TouchableOpacity style={container} onPress={this.props.pressed}>
        <View style={contentContainer}>
          <View style={styles.imgContainer}>
            <CachedImage
              style={img}
              source={{ uri: picture }}
            />
          </View>
          <View style={info}>
            <Text style={coachName}> {name} </Text>
            <Text style={schedule}>  {sport} </Text>
          </View>
        </View>
        <CachedImage
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
    flex: 2,
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
