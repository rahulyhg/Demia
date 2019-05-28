import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { NumberedBlock } from './NumberedBlock';

class CoachOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: !props.profilePic? {uri: props.profilePic} : require('../../../assets/icons/filler.png'),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profilePic) {
      this.setState({ profilePic: {uri: nextProps.profilePic}});
    }
  }

  render() {
    const {
      topContainer, textContainer, profilePic,
      overviewText, headerText, header, overviewText1,
      bottomContainer, container, dataContainer,
    } = styles;
    return (
      <View style={container}>
        <Text style={headerText}>Practices Booked</Text>
        <View style={dataContainer}>
            <NumberedBlock data={this.props.scheduled} name="Scheduled"/>
            <NumberedBlock data={this.props.week} name="This week" />
            <NumberedBlock data={this.props.unscheduled} name="Unscheduled"/>
        </View>
      </View>
    );
  };
}

const styles = ScaledSheet.create({
  profilePic: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    borderColor: '#27a587',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: '2@ms',
  },
  textContainer: {
    // marginLeft: '10@ms',
    justifyContent: 'center',
  },
  overviewText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: '15@ms',
    fontFamily: 'Roboto-Medium',
    color: '#474747',
    marginLeft: '10@ms',
    paddingLeft: '7@ms',
  },
  headerText: {
    fontSize: '26@ms',
    fontFamily: 'Raleway-SemiBold',
    color: 'dimgrey',
    marginLeft: '5@ms',
    alignSelf: 'center',
  },
  container: {
    borderRadius: 10,
    margin: '10@ms',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
})
export { CoachOverview };
