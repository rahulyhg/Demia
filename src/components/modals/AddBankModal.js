import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import VPStatusBar from './VPStatusBar';
import { TextLine } from '../containers';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
var _ = require('lodash');
import { CachedImage } from 'react-native-cached-image';


class AddBankModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      name: '',
      routingNumber: '',
      accountNumber: '',
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  onSave() {
    const holderName = this.state.name;
    const routingNumber = this.state.routingNumber;
    const accountNumber = this.state.accountNumber;
    if (holderName, routingNumber, accountNumber == '') {
      return this.emptyAlert()
    }
    const bankInfo = {
      holderName,
      routingNumber,
      accountNumber,
    };

    this.props.onSave(bankInfo);
    this.toggleVisible();
  }

  emptyAlert() {
    Alert.alert('You left a field empty');
  }

  renderForm() {
    return (
        <View style={styles.formView}>
          <TextLine
            placeholder="Account holder"
            inputStyle={{width: scale(300)}}
            typed={(text) => this.setState({ name: text })}
          />
          <TextLine
            placeholder="Routing number"
            typed={(text) => this.setState({ routingNumber: text })}
            secure={true}
            inputStyle={{width: moderateScale(250)}}
            maxLength={9}
            keyboardType="numeric"
          />
          <TextLine
            placeholder="Account number"
            typed={(text) => this.setState({ accountNumber: text })}
            secure={true}
            inputStyle={{width: moderateScale(250)}}
            maxLength={12}
            keyboardType="numeric"
          />
        </View>
    );
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modal}>
          <View style={styles.container}>
            <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

            <TouchableOpacity style={styles.xContainer} onPress={this.toggleVisible.bind(this)}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.headerText}>Add a Checking Account</Text>
            </View>

            <KeyboardAvoidingView behavior="position">
              {this.renderForm()}
            </KeyboardAvoidingView>

            <TouchableOpacity onPress={this.onSave.bind(this)} style={styles.saveContainer}>
              <Text style={styles.saveText}>Save Account</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    )
  }
}

const styles = ScaledSheet.create({
  navImage: {
    width: scale(37),
    height: verticalScale(37),
    padding: moderateScale(10),
    marginTop: verticalScale(10),
  },
  modal: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  xContainer: {
    margin: '10@ms',
    width: '50@ms',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
  },
  horz: {
    margin: '10@ms',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '30@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vert: {
    margin: '10@ms',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '30@ms',
  },
  formView: {
    margin: '10@ms',
    marginTop: '20@ms',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: '34@ms',
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
  },
  header: {
    marginLeft: '20@ms',
  },
  group: {
    flexDirection: 'row',
  },
  saveContainer: {
    alignSelf: 'center',
  },
  saveText: {
    fontSize: '26@ms',
    fontFamily: 'Montserrat-Medium',
    color: '#314855',
    textAlign: 'center',
  },
})

export  { AddBankModal };
