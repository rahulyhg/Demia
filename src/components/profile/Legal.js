import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-cached-image';
import { BackNavBar, Block, } from '../common';
import { basics } from '../../stylesheet';
import Communications from 'react-native-communications';

class Legal extends Component {
  render() {
    return (
      <Block>
        <BackNavBar />
        <View style={styles.container}>
          <Text style={styles.header}>Legal</Text>

        </View>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '15@ms',
  },
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
  },
  infoContainer: {
    marginTop: '15@ms',
  },
})

export default Legal;
