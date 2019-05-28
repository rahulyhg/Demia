import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import FastImage from 'react-native-fast-image';

class BackNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottonRow: props.bottomRow,
      topStyle: {marginTop: moderateScale(10)},
      backArrow: require('../../../assets/icons/backArrow.png'),
      isConnected: true
    }
  }

  componentDidMount() {
    // this.checkConnection()
    var iphoneX = this.isIphoneX();
    if (iphoneX) {
      this.iphoneXOptimization();
    }
    if (this.props.backArrow) {
      this.setState({ backArrow: this.props.backArrow})
    }
  }

  checkConnection = () => {
    try {
      fetch('https://www.google.com/').then((resp) => {
          console.log('resp', resp)
          probablyHasInternet = resp.status === 200 || resp.status === 503;
          this.setState({ isConnected: probablyHasInternet })
        }).catch((e) => {
          console.log(e)
          probablyHasInternet = false;
          this.setState({ isConnected: probablyHasInternet })
        })
    } catch(err) {
      this.setState({ isConnected: false })
    }
  }

  isIphoneX() {
    let d = Dimensions.get('window');
    const { height, width } = d;

    return (
      // This has to be iOS duh
      Platform.OS === 'ios' &&

      // Accounting for the height in either orientation
      (height === 812 || width === 812)
    );
  }

  iphoneXOptimization() {
    //stuff for iphone x nav bar
    // this.setState({ topStyle: {marginTop: -10}})
  }

  onBackBtnPressed = () => {
    if (this.props.drawerPress) {
      this.props.drawerPress()
    } else {
      Actions.pop()
    }
  }

  renderNetworkStatus() {
    if (!this.state.isConnected) {
      return (
        <View style={styles.networkAlert}>
          <Text style={styles.networkText}>No Internet Connection!</Text>
        </View>
      )
    }
  }

  render() {
    const {
      leftBtnView, titleStyle, rightBtnStyle, titleView,
      container, optionText, option, top } = styles;
    const {
      children, rightBtn, optionPress, title, style,
      titleViewStyle, titleText, backArrow } = this.props;

    return (
      <View style={[container, style]}>

        <View style={[top, this.props.topStyle]}>

          <View style={leftBtnView}>
            <TouchableOpacity onPress={this.onBackBtnPressed}>
              <FastImage
                source={this.state.backArrow}
                style={styles.navImage}
              />
            </TouchableOpacity>
          </View>

          <View style={[titleView, titleViewStyle]}>
            <Text style={[titleStyle, titleText]}>{title}</Text>
          </View>

          <TouchableOpacity style={option} onPress={optionPress}>
            <Text style={optionText}>{rightBtn}</Text>
          </TouchableOpacity>

        </View>

        {this.renderNetworkStatus()}
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    height: '60@vs',
    backgroundColor: '#FEF7F0',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    marginBottom: '4@vs',
  },
  top: {
    marginTop: '10@ms',
    paddingBottom: '5@vs',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftBtnView: {
    justifyContent: 'center',
    paddingLeft: '10@s',
    paddingRight: '20@s',
  },
  titleView: {
    alignSelf: 'flex-end',
    marginLeft: '37@s',
  },
  titleStyle: {
    fontSize: '26@ms',
    textAlign: 'right',
    color: 'dimgrey',
    fontFamily: 'Raleway-SemiBold',
  },
  optionText: {
    fontSize: '22@ms',
    fontFamily: 'Raleway-Regular',
    color: 'dimgrey'
  },
  option: {
    marginRight: '10@s',
    justifyContent: 'center',
    borderColor: '#27a587',
    borderRadius: 25,
    alignSelf: 'center'
  },
  navImage: {
    width: '44@ms',
    height: '44@ms',
    padding: '10@ms',
    alignSelf: 'center',
  },
  networkAlert: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: '2@ms',
    marginBottom: '20@ms',
  },
  networkText: {
    alignSelf: 'center',
    color: 'dimgrey',
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
})

export { BackNavBar };
