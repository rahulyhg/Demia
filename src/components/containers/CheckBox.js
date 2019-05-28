import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';

class CheckBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected,
      title: props.title,
    }
  }

  toggleCheck() {
    this.setState({ selected: !this.state.selected });
  }

  renderChecked() {
    const title = this.props.title;
    console.log('title picked');
    this.props.titlePicked(title);
    if (this.state.selected == true) {
      return <View style={styles.checked}/>;
    }
  }

  render() {
    const { container, optionText, box, optionContainer, checked } = styles;
    return (
      <View style={container}>
        <TouchableOpacity onPress={() => this.toggleCheck()}>
          <View style={optionContainer}>
            <Text style={optionText}>{this.state.title}</Text>
            <View style={box}>
              {this.renderChecked()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    marginRight: '30@ms',
  },
  optionText: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  box: {
    marginLeft: '20@ms',
    borderRadius: '5@ms',
    borderWidth: '1@ms',
    borderColor: 'dimgrey',
    width: '25@ms',
    height: '25@ms',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#E9452B',
    margin: '2@ms',
    width: '18@ms',
    height: '18@ms',
    borderRadius: '5@ms',
    alignSelf: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '10@ms',
  },
})

export { CheckBox };
