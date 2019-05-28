import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import GridBlock from './GridBlock';

const Grid = ({ children, style }) => {
  const { container, view, view1 } = styles;
  return (
    <ScrollView >
      <View style={container}>
        {children}
      </View>
      <View style={{ marginBottom: 10 }}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  view: {
    width: 172,
    height: 150,
    backgroundColor: '#01b287',
    marginTop: 10,
    marginLeft: 10,
  },
  view1: {
    backgroundColor: '#01b287',
  },
});

export { Grid };
