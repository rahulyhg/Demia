import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  Block,
  NavBar,
  SignupSection,
} from '../common';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class LockerRoom extends Component {
  renderList() {
    const { item } = this.props;
    return (
      <View style={styles.listContainer}>
      <FlatList
        data={item}
        renderItem={({ item }) => (
          <Text>item.title</Text>
        )}
      />
      </View>
    )
  }

  render() {
    const { title, info } = this.props;
    return (
      <Block>
        <NavBar
          drawerPress={() => Actions.pop()}
          rightBtn="More"
          titleViewStyle={{marginLeft: scale(16) }}
          >
          <TouchableOpacity onPress={() => Actions.pop()}>
            <CachedImage
              source={require('../../../assets/icons/backArrow.png')}
              style={styles.navImage}
            />
          </TouchableOpacity>
        </NavBar>

        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.info}>
              {info}
            </Text>
          </View>
          {this.props.children}
          <View>
            <CachedImage
              source={require('../../../assets/icons/wistle.png')}
              style={styles.img}
            />
          </View>
        </ScrollView>
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  header: {
    backgroundColor: '#27a587',
    width: '100@ms',
    alignSelf: 'center',
  },
  headerText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: '30@ms',
    color: '#595959',
    textAlign: 'center',
  },
  img: {
    width: '65@ms',
    height: '65@ms',
    alignSelf: 'center',
  },
  info: {
    fontSize: '22@vs',
    fontFamily: 'Raleway-Medium',
    margin: '15@ms',
    color: '#393939',
  },
  container: {
    marginLeft: '5@ms',
    paddingTop: '10@ms',
  },
  listContainer: {
    marginLeft: '5@ms',
    paddingTop: '10@ms',
  },
  navImage: {
    width: '44@ms',
    height: '44@ms',
    padding: '10@ms',
    alignSelf: 'center',
  },
})

export default LockerRoom;
