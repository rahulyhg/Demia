import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from  'react-native'
import { Section } from '../common/Section'
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters'
import StarRating from 'react-native-star-rating'

class ParentCard extends Component {

  pressed() {
    if (this.props.contact) {
      this.props.showContactCard()
    }
  }

  render() {
    const { name, athleteName, sport } = this.props
    const { container, parent, athlete} = styles

    return (
      <TouchableWithoutFeedback onPress={() => this.pressed()}>
        <View style={container}>
          <Text style={parent}>Parent:  {name? name: ''}</Text>
          <Text style={athlete}>Athlete:  {athleteName? athleteName: ''}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    marginLeft: '8@ms',
    marginRight: '8@ms',
    marginTop: '7@ms',
    borderRadius: '5@ms',
    borderColor: 'dimgrey',
    borderWidth: '3@ms',
  },
  parent: {
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    fontSize: '18@ms',
    margin: '3@ms',
  },
  athlete: {
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    fontSize: '18@ms',
    margin: '3@ms',
  },
})

export { ParentCard }
