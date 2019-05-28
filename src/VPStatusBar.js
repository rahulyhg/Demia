import React, { Component } from 'react';
import {
  NativeModules,
  StatusBar,
  Platform,
  View,
  Dimensions,
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

const VPStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const { width, height } = Dimensions.get('window');

let STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const isIos = Platform.OS === 'ios';
const isIphoneX = isIos && Dimensions.get('window').height === 812;
// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

if (isIos && isIphoneX) {
  STATUSBAR_HEIGHT = 44;
} else if (isIos) {
  STATUSBAR_HEIGHT = 20;
} else {
  STATUSBAR_HEIGHT = StatusBar.currentHeight;
}


const styles = ScaledSheet.create({
  statusBar: {
  height: STATUSBAR_HEIGHT,
  },
})

export default VPStatusBar;
