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
import { Block, BackNavBar, SignupSection, Spinner } from '../common';
import { CoachPracticeCard, PracticeCard, EmptyCard } from '../containers';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class PastPractices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      practices: {},
      empty: false,
      loading: false,
      coach: false,
      parent: false,
      count: 0,
    };
  };

  componentDidMount() {
    if (this.props.coach) {
      this.fetchPractices();
    } else {
      this.fetchSchedule();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ref == true) {
      fetchSchedule();
    }
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <View style={{marginTop: verticalScale(20)}}>
          <Spinner />
        </View>
      )
    }
  }

  fetchSchedule() {
    this.setState({ loading: true });
    const user = firebase.auth().currentUser;
    var practices = [];
    var prevDates = [];
    var count = 0;
    if (user) {
      this.fetchPractices();
      try {
        firebase.firestore().collection('users')
        .doc(user.uid).collection('practices')
        .where("date", "<", new Date()).orderBy("date", "desc")
            .onSnapshot(querySnap => {
              if (querySnap.empty) {
                this.setState({
                  empty: true,
                  count: count
                })
              }

            practices = [];
            prevDates = [];
            querySnap.forEach((doc) => {
              count++
              this.setState({ practices: [] });
              var date = doc.data().date;
              var formattedDate = doc.data().formattedDate;

              if (!prevDates.includes(date) && formattedDate) {
                prevDates.push(date);
                practices.push(doc.data());
                this.setState({
                  practices: practices,
                  empty: false,
                  loading: false,
                  count: count,
                  parent: true,
                });
              }
              this.setState({practices: practices });
          })
        })
      } catch(err) {
        console.log('error fetching schedule');
      }
    }
  }

  fetchPractices() {
    var user = firebase.auth().currentUser;
    var count = 0;
    try {
      firebase.firestore().collection('coaches').doc(user.uid)
        .collection('practices').where("date", "<", new Date())
          .orderBy("date", "desc").onSnapshot((querySnap) => {
            if (querySnap.empty) {
              return this.setState({
                loading: false,
                empty: true,
              });
            }

            this.setState({ coach: true, empty: false });
            practices = [];
            prevDates = [];
            querySnap.forEach((doc) => {
              count++
              this.setState({ practices: [] });
              var date = doc.data().date;
              var formattedDate = doc.data().formattedDate;

              if (!prevDates.includes(date) && formattedDate) {
                prevDates.push(date);
                practices.push(doc.data());
                this.setState({
                  practices: practices,
                  empty: false,
                  loading: false,
                  count: count,
                  coach: true,
                });
              }
              this.setState({practices: practices });
            })
          })
    } catch(err) {
      console.log('error fetching practices')
    }
  }

  renderPractices() {
    var noPractices = "Your previous lessons will appear here";
    if (this.state.empty == true && this.state.loading == false) {
      return (
        <EmptyCard text={noPractices} />
      );
    } else if (this.state.parent) {
      return (
        <ScrollView style={styles.practiceContainer}>
          <FlatList
            data={this.state.practices}
            extraData={this.state.practices}
            renderItem={({ item }) => (
              <PracticeCard
                coach={item.coach}
                athlete={item.prep.nickname}
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
    } else if (this.state.coach && this.state.count > 0) {
      return (
        <ScrollView style={styles.practiceContainer}>
          <FlatList
            data={this.state.practices}
            extraData={this.state.practices}
            renderItem={({ item }) => (
              <CoachPracticeCard
                athlete={item.athlete.athleteName}
                color={this.state.color}
                sport={item.lesson.sport}
                date={item.date}
                formattedDate={item.formattedDate}
                location={item.location}
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
        />
          {this.renderLoading()}
          {this.renderPractices()}
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
  practiceContainer: {
    flex: 1,
    marginBottom: '10@ms',
  }
})

export default PastPractices;
