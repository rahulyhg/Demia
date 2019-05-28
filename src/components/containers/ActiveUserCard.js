import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import {
  ScaledSheet,
  moderateScale,
} from 'react-native-size-matters'
import { CachedImage } from 'react-native-cached-image'

class ActiveUserCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      badge: '',
      containerStyle: {},
    }
  }
  componentDidMount() {
    if (this.props.activePrep) {
      this.selectBadge()
      this.setSelectedContainer()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPrep) {
      this.setSelectedContainer()
    }
  }

  selectBadge() {
    const { badgeLevel } = this.props.activePrep.item
    let badge;

    switch (badgeLevel) {
      case 0:
        badge = {uri: 'https://firebasestorage.googleapis.com/v0/b/varsityprep-8fce6.appspot.com/o/badges%2Flevel0.png?alt=media&token=fb457e17-4ec4-4e2f-be9f-ec9475490cb2'}
        break;
      case 1:
        badge = {uri: 'https://firebasestorage.googleapis.com/v0/b/varsityprep-8fce6.appspot.com/o/badges%2Flevel1.png?alt=media&token=152ad484-0e24-4422-8ad6-e53bf2515456'}
        break;
      default:
        badge = {uri: 'https://firebasestorage.googleapis.com/v0/b/varsityprep-8fce6.appspot.com/o/badges%2ForangeLevel1.png?alt=media&token=34cb855b-352c-4f0f-bd3f-19acdc264ff6'}
    }
    this.setState({ badge: badge })
  }

  setSelectedContainer() {
    const { activePrep, currentPrep } = this.props
    if (currentPrep) {
      const selectedStyle = activePrep.item.prepUid == currentPrep.prepUid? {borderColor: '#314855', borderWidth: moderateScale(3)} : {}
      this.setState({ containerStyle: selectedStyle })
    }
  }

  renderInfo() {
    if (this.props.activePrep) {
      const { dob, badge, grade, nickName } = this.props.activePrep.item
      return (
        <View>
          <Text></Text>
          <Text></Text>
          <View>
            <Text></Text>
          </View>
        </View>
      )
    }
  }

  onSelectPrep = () => {
    if (this.props.activePrep) {
      this.props.pressed(this.props.activePrep.item)
    } else {
      this.props.pressed()
    }
  }

  render() {
    const { pressed, activePrep, currentPrep } = this.props
    const { container, top, bottom, picContainer, profilePic, prepName } = styles
    const source = activePrep? this.state.badge : require('../../../assets/icons/add.png');
    const emptyStyle = activePrep? {} : {fontSize: moderateScale(23), fontFamily: 'Montserrat-Medium', textAlign: 'center'}

    return (
      <TouchableOpacity onPress={this.onSelectPrep}>
        <View style={[container, this.state.containerStyle]}>
          <View style={top}>
            <View style={picContainer}>
              <CachedImage
                source={source}
                style={profilePic}
              />
            </View>
            <Text style={[prepName, emptyStyle]}>{activePrep? `${activePrep.item.name}`: 'Add a new user'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '10@ms',
    marginLeft: '15@ms',
    marginRight: '15@ms',
    borderWidth: '2@ms',
    borderColor: 'dimgrey',
    borderRadius: '7@ms',
  },
  picContainer: {
    width: '40@ms',
    height: '40@ms',
    borderRadius: '20@ms',
    margin: '5@ms',
    justifyContent: 'center',
  },
  profilePic: {
    width: '34@ms',
    height: '34@ms',
    borderRadius: '17@ms',
    alignSelf: 'center',
  },
  top: {
    flexDirection: 'row',
  },
  bottom: {

  },
  prepName: {
    fontSize: '20@ms',
    fontFamily: 'Roboto-Regular',
    color: 'dimgrey',
    alignSelf: 'center',
  },
})

export { ActiveUserCard };
