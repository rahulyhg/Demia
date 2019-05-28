import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const InfoItem = ({title, details}) => {
  const { titleStyle, detailsStyle, containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <View>
        <Text style={titleStyle}>{title}</Text>
      </View>
      <View>
        <Text
        style={detailsStyle}
        numberOfLines={25}
        >{details}</Text>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  containerStyle: {
    flex: 1,
    borderBottomWidth: '2@ms',
    borderColor: '#989898',
    paddingBottom: '10@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '17@ms',
  },
  titleStyle: {
    fontSize: '20@ms',
    color: 'dimgrey',
    marginLeft: '10@s',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: '8@ms',
  },
  detailsStyle: {
    fontSize: '20@ms',
    marginLeft: '10@s',
    marginRight: '6@s',
    color: '#686868',
    fontFamily: 'Roboto-Regular',
  },
});


export { InfoItem };
