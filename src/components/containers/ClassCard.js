import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { SignupSection } from '../common';
import { CachedImage } from 'react-native-cached-image';
import {
  ScaledSheet,
} from 'react-native-size-matters';


class ClassCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showRemoveBtn: false,
    }
  }

  onRemoveClass = () => {
    console.log('on remove class')
    this.props.removeClass()
  }

  showRemoveBtn = () => {
    this.setState({ showRemoveBtn: !this.state.showRemoveBtn })
  }

  renderRemove() {
    if (this.state.showRemoveBtn) {
      return (
        <TouchableOpacity style={styles.removeBtn} onPress={this.onRemoveClass}>
          <CachedImage
            source={require('../../../assets/icons/redX.png')}
            style={styles.img}
          />
        </TouchableOpacity>
      )
    }
  }

  render() {
    const { className, teacher } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.showRemoveBtn}
      >
        <View style={styles.info}>
          <Text style={styles.className}>{className}</Text>
          <Text style={styles.teacher}>{teacher}</Text>
        </View>
        {this.renderRemove()}
      </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '10@ms',
    borderColor: 'dimgrey',
    borderRadius: '5@ms',
    borderWidth: '3@ms',
    flexDirection: 'row',
    padding: '2@ms',
    justifyContent: 'space-between'
  },
  info: {
    margin: '3@ms',
  },
  className: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  teacher: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  removeBtn: {
    justifyContent: 'center',
  },
  img: {
    width: '40@ms',
    height: '40@ms',
    alignSelf: 'center',
    marginRight: '5@ms',
  },
})

export { ClassCard }
