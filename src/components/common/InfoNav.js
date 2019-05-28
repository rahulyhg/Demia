import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';


class InfoNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottonRow: props.bottomRow,
      topStyle: {marginTop: moderateScale(10)},
    }
  }

  componentDidMount() {
    var iphoneX = this.isIphoneX();
    if (iphoneX) {
      this.iphoneXOptimization();
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

  renderBottomRow() {
    const { secondRow } = this.props;
    if (this.props.bottomRow) {
      return (
        <View>
          {secondRow}
        </View>
      );
    }
  }

  iphoneXOptimization() {
    //stuff for iphone x nav bar
    // this.setState({ topStyle: {marginTop: -10}})
  }

  render() {
    const {
      leftBtnView, titleStyle, rightBtnStyle, titleView,
      container, optionText, option, top } = styles;
    const {
      children, rightBtn, optionPress, title, style,
      titleViewStyle, titleText } = this.props;

    return (
      <View style={[container, style]}>

        <View style={[top, this.props.topStyle]}>

          <View style={leftBtnView}>
            {children}
          </View>

          <View style={[titleView, titleViewStyle]}>
            <Text style={[titleStyle, titleText]}>{title}</Text>
          </View>

          <TouchableOpacity style={option} onPress={optionPress}>
            <Text style={optionText}>{rightBtn}</Text>
          </TouchableOpacity>

        </View>

        {this.renderBottomRow()}

      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    height: '60@vs',
    backgroundColor: '#fff',
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
    fontFamily: 'Atletico Medium',
  },
  optionText: {
    fontSize: '22@ms',
    fontFamily: 'Atletico Medium',
    color: 'dimgrey'
  },
  option: {
    marginRight: '10@s',
    justifyContent: 'center',
    borderColor: '#27a587',
    borderRadius: 25,
    alignSelf: 'center'
  },
})

export { InfoNav };
