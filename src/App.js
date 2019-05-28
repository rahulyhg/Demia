import React, { Component } from 'react';
import { View, AsyncStorage, Alert, } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import Router from './Router';
import VPStatusBar from './VPStatusBar';
import firebase from 'react-native-firebase'
import logger from 'redux-logger'


export default class App extends Component {
  componentWillMount() {
    this.checkPermission()
    this.createNotificationListeners()

    // this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    //     console.log('TOKEN', fcmToken)
    // });
  }

  componentWillUnmount() {
    this.notificationListener()
    this.notificationOpenedListener()
    this.onTokenRefreshListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

    //3
  async getToken() {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if (fcmToken) {
            // console.log('TOKEN', fcmToken)
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
      } else {
        // console.log(fcmToken)
      }
    } catch(err) {
      // console.log('token rejected', err)
    }
  }

    //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      // console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body)
    })

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    })

    const notificationOpen = await firebase.notifications().getInitialNotification()
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification
        this.showAlert(title, body)
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message))
    })
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk, logger))
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <VPStatusBar backgroundColor="#243238" barStyle="light-content"/>
          <Router />
        </View>
      </Provider>
    )
  }
}
