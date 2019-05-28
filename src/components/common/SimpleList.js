import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const SimpleList = ({ data, onPress, info }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) =>
            <TouchableOpacity >
              <Text style={styles.item}>{item.key}</Text>
            </TouchableOpacity>
      }/>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
  },
  item: {
    fontSize: '18@ms',
    height: '44@vs',
    marginLeft: '10@s',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
})

export { SimpleList };
