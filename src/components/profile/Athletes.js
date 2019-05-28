import React, {Component} from 'react';
import {
  View,
  Style,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Block,
  SignupSection,
  NavBar,
  BackNavBar,
} from '../common';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { AthleteCard } from '../containers';
import { CachedImage } from 'react-native-cached-image';

class Athletes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      athletes: [],
      empty: true,
    };
  }

  componentDidMount() {
    this.fetchAthletes();
  }

  fetchAthletes() {
    var athletes = [];
    var nameArray = [];
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        firebase.firestore().collection('users').doc(user.uid)
          .collection('practices')
              .onSnapshot((querySnap) => {
              if (querySnap.empty == true) {
                  this.setState({ empty: true });
                  console.log('empty');
              }

              querySnap.forEach((doc) => {
                var name = doc.data().athlete.athleteName;
                if (!nameArray.includes(name)) {
                  nameArray.push(name);
                  athletes.push(doc.data());
                  this.setState({ athletes: athletes, empty: false });
                }
              })
            })
      } catch(err) {
        console.log('error fetching athletes');
      }
    }
  }

  renderAthletes() {
    const noCoaches = "Once you book a lesson your preps will appear here.";
    if (this.state.empty == true) {
      return (
        <View style={styles.emptyContainer}>
          <SignupSection style={{flexDirection: 'column'}}>
              <CachedImage
                source={require('../../../assets/icons/wistle.png')}
                style={styles.imageStyle}
              />
              <Text style={styles.uhOhText}>
                {noCoaches}
              </Text>
          </SignupSection>
        </View>
      );
    } else {
      return (
          <FlatList
            data={this.state.athletes}
            extraData={this.state.athletes}
            renderItem={({ item }) => (
              <AthleteCard
                athlete={item.athlete.athleteName}
                coach={item.coach}
                sport={item.lesson.sport}
              />
            )}
            keyExtractor={ item => item.id.toString() }
          />
      );
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title="Preps"
          drawerPress={() => Actions.pop({ ref: true })}
          titleViewStyle={{ marginLeft: scale(-50) }}
        />
        {this.renderAthletes()}
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  emptyContainer: {
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
    backgroundColor: '#fff',
  },
  imageStyle: {
    width: scale(65),
    height: verticalScale(65),
    alignSelf: 'center',
  },
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  item: {
    fontSize: '18@ms',
    height: '44@vs',
    marginLeft: '10@s',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
})

export default Athletes;
