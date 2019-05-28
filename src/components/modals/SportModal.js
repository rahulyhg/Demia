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

class SportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  onSearch() {
    this.props.search();
    this.toggleVisible();
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

            <View style={vertBox}>
              <View>
                <Text style={styles.title}>Activity</Text>
              </View>

              <View style={styles.children}>
                {children}
              </View>
            </View>

{/*            <TouchableOpacity onPress={() => this.onSearch()}>
              <Text style={search}>Search</Text>
            </TouchableOpacity>*/}

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
  horizBox: {
    margin: '10@ms',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '30@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vertBox: {
    margin: '10@ms',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '30@ms',
  },
  title: {
    fontSize: '22@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  search: {
    fontSize: '24@ms',
    fontFamily: 'Montserrat-Medium',
    color: '#27a587',
    textAlign: 'center',
  },
  children: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: '20@ms',
  }
})

export { SportModal };
