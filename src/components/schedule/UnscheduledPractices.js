import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  BackNavBar,
  Block,
  SignupSection,
  Spinner,
} from '../common';
import { ParentCard, } from '../containers';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import firebase from 'react-native-firebase';

class UnscheduledPractices extends Component {
  
  constructor(props) {
    super(props);
    var today = new Date()
    today.setDate(today.getDate() + 2);
    this.state = {
      coach: 'Select Coach',
      athlete: 'Athlete',
      formattedDate: 'Date',
      date: '',
      minDate: today,
      loading: false,
      unscheduledPractices: [],
      empty: false,
      color: styles.greyBorder,
      toggle: false,
      showModal: false,
      practice: {
        coach: 'Alex Durmitov',
        lesson: {
          sport: 'Soccer',
        },
        athlete: {
          athleteName: 'Sam',
        },
      },
      location: 'Map Location',
      notes: '',
    }
  }

  componentDidMount() {
    this.fetchUnschedule();
  }

  fetchUnschedule() {
    this.setState({ loading: true });
    const user = firebase.auth().currentUser;

    if (user) {
      var unscheduledPractices = [];
      try {
        firebase.firestore().collection('coaches').doc(user.uid).collection('lessons')
        .where("scheduled", "==", false).onSnapshot(querySnap => {
          if (querySnap.isempty) {
            this.setState({ loading: false, empty: true});
          }
          var count = 0;
          querySnap.forEach((doc) => {
            unscheduledPractices.push(doc.data());
            count++;
            this.setState({
              unscheduled: count,
              unscheduledPractices: unscheduledPractices,
              loading: false,
            })
          })
        })
      } catch(err) {
        console.log('error fetching unscheduled');
      }
    }
  }

  renderUnscheduled(unscheduledPractices) {
      return (
        <FlatList
          data={this.props.unscheduledPractices}
          renderItem={({ item }) => (
            <ParentCard
              name={item.user.parentName}
              athleteName={item.prep.name}
              sport={item.lesson.sport}
              contact={false}
            />
          )}
          keyExtractor={ item => item.id.toString()}
        />
      );
  }

  renderEmpty() {
    if (this.state.empty) {
      return (
        <View style={styles.emptyContainer}>
          <SignupSection style={{flexDirection: 'column'}}>
              <Image
                source={require('../../../assets/icons/wistle.png')}
                style={styles.imageStyle}
              />
              <Text style={styles.uhOhText}>
                {noPractices}
              </Text>
          </SignupSection>
        </View>
      );
    }
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <View style={{marginTop: verticalScale(20)}}>
          <Spinner />
        </View>
      );
    }
  }

  render() {
    return (
      <Block style={{justifyContent: 'space-between'}}>
        <BackNavBar
          title="Booked Practices"
          drawerPress={() => Actions.pop({ ref: true })}
          titleViewStyle={{ marginLeft: scale(-20) }}
        />


        <ScrollView style={{flex: 1, marginBottom: verticalScale(10)}}>
          {this.renderLoading()}
          {this.renderUnscheduled(this.props.unscheduledPractices)}
          {this.renderEmpty()}
        </ScrollView>

      </Block>
    );
  };
}

const styles = ScaledSheet.create({
  greyBorder: {
    borderColor: 'dimgrey',
  },
  greenBorder: {
    borderColor: '#E64834',
  },
  background: {
    backgroundColor: '#fff',
  },
  scheduleBtn: {
    backgroundColor: '#fff',
    marginLeft: '30@s',
    marginRight: '10@s',
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    marginTop: '10@s',
  },
  scheduleText: {
    fontSize: '17@ms',
    fontFamily: 'Roboto-Regular',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    margin: '10@s',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  containerStore: {
    flex: 1,
    backgroundColor: '#rgba(12,12,12,0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    marginTop: '150@ms',
    paddingBottom: '10@s',
    paddingTop: '10@s',
  },
  container2: {
    backgroundColor: '#fff',
    marginLeft: '10@s',
    marginRight: '10@s',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
    flex: .2,
  },
  section: {
    marginLeft: scale(13),
    marginRight: scale(13),
    borderRadius: 10,
  },
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
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
})



export default UnscheduledPractices;
