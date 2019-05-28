import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import {
  ScaledSheet,
} from 'react-native-size-matters';
import { CachedImage } from 'react-native-cached-image';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: props.count,
    }
  }

  add() {
    if (this.state.count < this.props.max) {
      this.setState({count: this.state.count + 1})
      setTimeout(() => this.countChanged() ,30)
    }
  }

  minus() {
    if (this.state.count > 1) {
      this.setState({count: this.state.count - 1});
      setTimeout(() => this.countChanged() ,30)
    }
  }

  countChanged() {
    this.props.countChanged(this.state.count);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.minus.bind(this)}>
          <CachedImage
            source={require('../../../assets/icons/subtract.png')}
            style={styles.countImg}
          />
        </TouchableOpacity>

        <View style={styles.textCont}>
          <Text style={styles.countText}>{this.state.count}{this.props.variable}</Text>
        </View>

        <TouchableOpacity onPress={this.add.bind(this)}>
          <CachedImage
            source={require('../../../assets/icons/add.png')}
            style={styles.countImg}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  countImg: {
    width: '40@ms',
    height: '40@ms',
  },
  countText: {
    fontSize: '24@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  textCont: {
    justifyContent: 'center',
    marginLeft: '5@ms',
    marginRight: '5@ms',
  },
})

export { Counter };
