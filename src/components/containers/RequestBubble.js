import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

class RequestBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    }

    // setInterval(() => {
    //   this.setState(previousState => {
    //     return { show: !previousState.show };
    //   });
    // }, 1000);
  }

  flashBubble() {
    if (this.state.show) {
      return (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{this.props.text}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View>
        {this.flashBubble()}
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  bubble: {
    width: '30@ms',
    height: '30@ms',
    borderRadius: '15@ms',
    borderWidth: '2@ms',
    borderColor: 'green',
    justifyContent: 'center',
  },
  bubbleText: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'green',
    textAlign: 'center',
  },
})

export { RequestBubble };
