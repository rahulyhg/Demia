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
import VPStatusBar from './VPStatusBar';
import { CachedImage } from 'react-native-cached-image';

class SigninModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  renderForm() {
    if (this.state.login) {
      return (
        <View style={styles.formView}>
        </View>
      )
    } else if (this.state.signup) {
      return (
        <View style={styles.formView}>
        </View>
      )
    }
  }

  render() {
    const {  modal, container, horizBox, vertBox, search } = styles;
    const { children, } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
      <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View onPress={() => this.toggleVisible()} style={modal}>
          <View style={container}>
            <TouchableOpacity style={styles.xContainer} onPress={() => this.toggleVisible()}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>


          </View>
        </View>
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  xContainer: {
    margin: '10@ms',
    width: '50@ms',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
  },
  formView: {
    margin: '10@ms',
  },
})

export { SigninModal };
