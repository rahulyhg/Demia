import React from 'react'
import {
  Text,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../common';
import {
  ScaledSheet,
} from 'react-native-size-matters'

class PrepSelect extends Component {
  render() {
    return (
      <Block>
        <BackNavBar title={this.props.name}/>

        <Text style={styles.headerText}>Prep Details</Text>

      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  headerText: {
    color: 'dimgrey',
    fontSize: '33@ms',
    fontFamily: 'Montserrat-Extrabold',
    marginLeft: '5@ms',
  },
})

export default PrepSelect;
