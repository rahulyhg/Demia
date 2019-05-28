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
import { formatPhoneNumber, unformatPhoneNumber } from '../../util/phone';

class Support extends Component {
  callSupport() {
    Communications.phonecall('2259079616')
  }

  textSupport() {
    Communications.text('2259079616')
  }

  emailSupport() {

  }

  renderInfo() {
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.subHeader}>Talk to Technical</Text>
        <Text style={styles.subHeader}>- Jonathan -</Text>

        <TouchableOpacity style={styles.nameContainer} onPress={() => this.callSupport()}>
          <Text style={styles.name}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nameContainer} onPress={() => this.textSupport()}>
          <Text style={styles.name}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nameContainer} onPress={() => this.emailSupport()}>
          <Text style={styles.name}>Email</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Block>
        <BackNavBar />
        <View style={styles.container}>
          <Text style={styles.header}>Support</Text>
          <Text style={basics.subHeader}>{supportDescription}</Text>

          {this.renderInfo()}
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
  subHeader: {
    fontSize: '22@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
    textAlign: 'center',
  },
  name: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    marginRight: '10@ms',
    color: '#314855',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

const supportDescription = "Having problems? We'd be happy to help with anything. See below for spport.";

export default Support;
