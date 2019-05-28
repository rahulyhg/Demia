import React from 'react';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import {
  ScaledSheet,
} from 'react-native-size-matters';

const  UnscheduledCard = ({ athlete, coach, color, selected }) => {
  const { container, nameContainer, coachContainer, nameText, coachText } = styles;
    return (
      <TouchableOpacity onPress={selected} style={[container, color]}>
        <View style={nameContainer}>
          <Text numOfLines={2} style={nameText}>
            {athlete}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <View style={coachContainer}>
            <Text numOfLines={3} style={coachText}>
              Session with <Text style={styles.coachName}>{coach}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
}


const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#fff',
    marginLeft: '5@s',
    marginRight: '5@s',
    marginTop: '10@vs',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#393939',
    shadowOpacity: .1,
    shadowRadius: 10,
  },
  nameContainer: {
    marginLeft: '10@s',
    paddingRight: '10@s',
    justifyContent: 'center',
    borderRightWidth: '2@s',
    borderColor: 'dimgrey',
  },
  coachContainer: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: '20@ms',
    fontFamily: 'Roboto-Regular',
  },
  coachText: {
    fontSize: '19@ms',
    fontFamily: 'Roboto-Regular',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  coachName: {
    fontSize: '19@ms',
    fontFamily: 'Roboto-Medium',
  },
});

export  { UnscheduledCard };
