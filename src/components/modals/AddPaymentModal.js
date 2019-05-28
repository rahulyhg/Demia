import React, { Component } from 'react';
import {
    View,
    Text,
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
import { CachedImage } from 'react-native-cached-image';


class AddPaymentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      name: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      zip: '',
    }
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  onSave() {
    const name = this.state.name
    const number = this.state.cardNumber
    const cvc = this.state.cvc
    const address_zip =  this.state.zip
    var expiry = this.state.expiry

    if (!name || !number || cvc.length !== 3 || address_zip.length !== 5 || !expiry) {
      console.log(name, number, address_zip, cvc.length, expiry)
      return this.emptyAlert()
    }
    var expiry = expiry.split('/');
    const exp_month = expiry[0]
    const exp_year = expiry[1]

    const cardInfo = {
      name,
      number,
      exp_month,
      exp_year,
      cvc,
      address_zip,
    }
    this.props.onSave(cardInfo);
    this.toggleVisible();
  }

  emptyAlert() {
    Alert.alert(`Please make sure you've filled out each field correctly.`);
  }

  formatDate(s) {
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{2})(\d{2})$/);
    var text = (!m) ? null :  + m[1] + "/" + m[2] ;
    this.setState({ expiry: text });
  }

  renderForm() {
    return (
        <View style={styles.formView}>
          <TextLine
            placeholder="Card holder"
            inputStyle={{width: scale(300)}}
            typed={(text) => this.setState({ name: text })}
          />
          <TextLine
            placeholder="Card number"
            typed={(text) => this.setState({ cardNumber: text })}
            secure={true}
            inputStyle={{width: moderateScale(250)}}
            maxLength={16}
            keyboardType="numeric"
          />
          <View style={styles.group}>
            <TextLine
              placeholder="MM / YY"
              text={this.state.expiry}
              typed={(text) => this.formatDate(text)}
              date={true}
              maxLength={5}
              keyboardType="numeric"
            />
            <TextLine
              placeholder="CCV"
              typed={(text) => this.setState({ cvc: text })}
              maxLength={3}
              keyboardType="numeric"
            />
          </View>
          <TextLine
            placeholder="Zip"
            typed={(text) => this.setState({ zip: text })}
            maxLength={5}
            keyboardType="numeric"
          />
        </View>
    );
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
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
              <Text style={styles.headerText}>Update your card</Text>
            </View>

            <KeyboardAvoidingView behavior="position">
              {this.renderForm()}
            </KeyboardAvoidingView>

            <TouchableOpacity onPress={this.onSave.bind(this)} style={styles.saveContainer}>
              <Text style={styles.saveText}>Save Card</Text>
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

export  { AddPaymentModal };
