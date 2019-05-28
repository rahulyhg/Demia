import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  LayoutAnimation,
  TouchableWithoutFeedback,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import {FlipSwitch} from './FlipSwitch'

class TimeCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      switch0: false,
      switch1: false,
      switch2: false,
      showOptions: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options) {
      this.setState({
        switch0: nextProps.options.morning,
        switch1: nextProps.options.afternoon,
        switch2: nextProps.options.evening,
      })
    }
  }

  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  onUpdate = () => {
    setTimeout(() => {
      const daySlot = {
        day: this.props.day,
        morning: this.state.switch0,
        afternoon: this.state.switch1,
        evening: this.state.switch2,
      }
      this.props.update(daySlot)
    }, 50)
  }

  renderOptions() {
    const { timeSlotText, slotsContainer, dayContainer, dayText, container } = styles
    if (this.state.showOptions) {
      return (
        <View style={slotsContainer}>

          <View style={dayContainer}>
            <Text style={timeSlotText}>Morning</Text>
            <FlipSwitch
              value={this.state.switch0}
              changeValue={() => {this.setState({ switch0: !this.state.switch0}); this.onUpdate()}}
            />
          </View>

          <View style={dayContainer}>
            <Text style={timeSlotText}>Afternoon</Text>
            <FlipSwitch
              value={this.state.switch1}
              changeValue={() => {this.setState({ switch1: !this.state.switch1}); this.onUpdate()}}
            />
          </View>

          <View style={dayContainer}>
            <Text style={timeSlotText}>Evening</Text>
            <FlipSwitch
              value={this.state.switch2}
              changeValue={() => {this.setState({ switch2: !this.state.switch2}); this.onUpdate()}}
            />
          </View>
        </View>
      )
    }
  }

  toggleOptions() {
    this.setState({ showOptions: !this.state.showOptions })
  }

  render() {
    const { day, morning, afternoon, evening } = this.props
    const { timeSlotText, slotsContainer, dayContainer, dayText, container } = styles
    return (
      <TouchableWithoutFeedback onPress={() => this.toggleOptions()} >
        <View style={container}>
          <Text style={dayText}>{day}</Text>

          {this.renderOptions()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    marginBottom: '10@ms',
    borderColor: 'dimgrey',
    borderBottomWidth: '2@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
  },
  timeSlotText: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Regular',
    fontSize: '20@ms',
    marginLeft: '10@ms',
    textAlign: 'center',
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '10@ms',
  },
  dayContainer: {
    justifyContent: 'center',
  },
  dayText: {
    color: 'dimgrey',
    fontFamily: 'Montserrat-Medium',
    fontSize: '22@ms',
    marginLeft: '10@ms',
    marginBottom: '5@ms',
  }
})

export { TimeCard };
