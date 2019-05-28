import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Block, BackNavBar, SignupSection } from '../common';
import { CoachingCard } from '../containers';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class PastCoachings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      practices: {},
      empty: true,
      role: 'user',
    };
  };

  componentDidMount() {
    this.fetchSchedule();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ref == true) {
      this.fetchSchedule();
    }

    if (nextProps.reload == true) {
      this.fetchSchedule();
    }
  }


  fetchSchedule() {
    const user = firebase.auth().currentUser;
    var practices = [];
    var prevDates = [];
    if (user) {
      firebase.firestore().collection('coaches')
      .doc(user.uid).collection('practices')
      .where("date", "<", new Date()).orderBy("date", "desc")
          .onSnapshot(querySnap => {
          if (querySnap.empty) {
              this.setState({empty: true});
          }
          practices = [];
          prevDates = [];
          querySnap.forEach((doc) => {
            this.setState({ practices: [] });
            var date = doc.data().date;
            var formattedDate = doc.data().formattedDate;

            if (!prevDates.includes(date) && formattedDate) {
              prevDates.push(date);
              practices.push(doc.data());
              this.setState({practices: practices, empty: false});
            }
            this.setState({practices: practices});
        })
      })
    }
  }

  renderPractices() {
    var noPractices = "Looks like you don't have any past practices";
    if (this.state.empty) {
      return (
        <View style={styles.emptyContainer}>
          <SignupSection style={{flexDirection: 'column'}}>
              <CachedImage
                source={require('../../../assets/icons/wistle.png')}
                style={styles.imageStyle}
              />
              <Text style={styles.uhOhText}>
                {noPractices}
              </Text>
          </SignupSection>
        </View>
      );
    } else {
      return (
        <ScrollView style={{flex: 1}}>
          <FlatList
            data={this.state.practices}
            extraData={this.state}
            renderItem={({ item }) => (
              <CoachingCard
                parentName={item.user.parentName}
                athlete={item.athlete.athleteName}
                color={this.state.color}
                sport={item.lesson.sport}
                date={item.date}
                formattedDate={item.formattedDate}
                location={item.location}
                notes={item.notes}
              />
            )}
            keyExtractor={ item => item.id.toString()}
          />
        </ScrollView>
      )
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title="Past Practices"
          titleViewStyle={{marginLeft: scale(-34)}}
          drawerPress={() => Actions.pop()}
        />
          <CoachingCard />
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
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    width: scale(65),
    height: verticalScale(65),
    alignSelf: 'center',
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
})

export default PastCoachings;
