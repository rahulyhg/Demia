import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
} from 'react-native';
import {
  Block,
  BackNavBar,
} from '../common';
import {
  saveBank,
  saveCoachCard,
  fetchSubmittedDocs,
  changeDefaultMethod,
  fetchMethod,
  fetchExternalCard,
} from '../../actions';
import { connect } from 'react-redux';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { AddPaymentModal, AddBankModal } from '../modals';
import {
  CardCard,
  BankCard,
  OptionItem,
  DefaultMethodCard,
} from '../containers';

const theme = {
  primaryBackgroundColor: '#4F6D7A',
  secondaryBackgroundColor: '#4F6D7A',
  primaryForegroundColor: '#fff',
  secondaryForegroundColor: '#FEF7F0',
  accentColor: '#F4EBE1',
  errorColor: '#F57C73'
};

class CoachPayment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bankName: '',
      processing: false,
      showPaymentModal: false,
      showBankModal: false,
      idSubmitted: false,
      personalInfoSubmitted: false,
      defaultMethod: ''
    }
  }

  componentDidMount() {
    this.props.fetchExternalCard()
    this.props.fetchSubmittedDocs()
    this.props.fetchMethod()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processing) {
      this.setState({ processing: nextProps.processing })
    }
    if (nextProps.accepted) {
      this.setState({ accepted: nextProps.accepted })
    }
    if (nextProps.submittedDocs) {
      const { idSubmitted, personalInfoSubmitted } = nextProps.submittedDocs
      this.setState({ tosAccepted, idSubmitted, personalInfoSubmitted })
    }
    if (nextProps.defaultMethod) {
      this.setState({ defaultMethod: nextProps.defaultMethod })
    }
    if (nextProps.message) {
      Alert.alert(nextProps.message)
    }
    if (nextProps.externalBank) {
      const { bankName, last4 } = nextProps.externalBank
      this.setState({ bankName: bankName, bankLast4: last4 })
    }
  }

  bankSelected = () => {
    const METHOD = 'bank_routing'
    this.props.changeDefaultMethod(METHOD)
  }

  cardSelected = () => {
    const METHOD = 'debit_card'
    this.props.changeDefaultMethod(METHOD)
  }

  addMethod(cardInfo) {
    this.props.saveCoachCard(cardInfo)
    setTimeout(() =>this.props.fetchExternalCard(), 1000)
  }

  addBank(bankInfo) {
    this.props.saveBank(bankInfo)
    setTimeout(() =>this.props.fetchExternalCard(), 1000)
  }

  togglePaymentModal() {
    this.setState({ 
      showBankModal: !this.state.showBankModal 
    })
  }

  toggleBankModal() {
    this.setState({
      showBankModal: !this.state.showBankModal,
    })
  }

  photoId() {
    const header = "Photo ID"
    const subHeader = "Send a clear photo of the front of a government issued photo ID."
    Actions.takePic({ subHeader: subHeader, header: header, title: 'photoId', docType: 'photoId' })
  }

  renderPersonalInfo() {
    if (this.state.personalInfoSubmitted == false || this.state.personalInfoSubmitted == undefined) {
      return (
        <OptionItem option="Personal Info" onPress={() => Actions.personalInfo({})}/>
      )
    }
  }

  renderPhotoId() {
    if (this.state.idSubmitted == false || this.state.idSubmitted == undefined) {
      return (
        <OptionItem option="Photo ID" onPress={() => this.photoId()}/>
      )
    }
  }

  renderNavBar() {
    return (
      <BackNavBar
        titleViewStyle={{marginLeft: scale(-47)}}
      />
    )
  }

  renderDefaultMethod() {
    return (
      <DefaultMethodCard
        bankSelected={this.bankSelected}
        cardSelected={this.cardSelected}
        selected={this.state.defaultMethod}
        card={this.props.externalCard}
      />
    )
  }

  renderDebit() {
    const { brand, last4 } = this.props.externalCard
    return (
      <CardCard
        cardType={brand? brand.toLowerCase(): ''}
        last4={last4}
        pressed={() => this.togglePaymentModal()}
      />
    )
  }

  renderRouting() {
    const { bankName, bankLast4 } = this.props.externalBank

    return (
      <BankCard
        pressed={() => this.toggleBankModal()}
        last4={bankLast4}
        bankName={bankName}
      />
    )
  }

  renderProcessing() {
    if (this.state.processing) {
      return (
        <Text style={styles.processingText}>Processing</Text>
      )
    }
  }

  renderPaymentModal() { //somewhere card number is being fed the wrong values
    if (this.state.showPaymentModal) {
      return (
        <AddPaymentModal
          visible={true}
          onSave={(cardInfo) => this.addMethod(cardInfo)}
          toggleVis={() => this.togglePaymentModal()}
        />
      )
    }
  }

  renderBankModal() {
    if (this.state.showBankModal) {
      return (
        <AddBankModal
          visible={true}
          onSave={(bankInfo) => this.addBank(bankInfo)}
          toggleVis={() => this.toggleBankModal()}
        />
      )
    }
  }

  renderIdentity() {
    const { tosAccepted, idSubmitted, personalInfoSubmitted } = this.state
    const allAccepted = false
    if (tosAccepted && idSubmitted && personalInfo) {
      return allAccepted = true
    }
    if (!allAccepted) {
      return (
        <View style={styles.formView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subHeader}>Identity</Text>
            {this.renderProcessing()}
          </View>
          <Text style={styles.info}>This information is kept secure and is needed to confirm your identity.</Text>
          {this.renderPersonalInfo()}
          {this.renderPhotoId()}
        </View>
      )
    }
  }

  render() {
    return (
      <Block>
        {this.renderNavBar()}
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerText}>Financials</Text>
            <Text>We keep your financial details secure so no one sees your sensitive info.</Text>
          </View>

          {this.renderRouting()}
          {this.renderDebit()}
          {this.renderDefaultMethod()}

          {this.renderIdentity()}
        </ScrollView>
        {this.renderPaymentModal()}
        {this.renderBankModal()}
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  header: {
    marginLeft: '15@ms',
    marginRight: '15@ms',
    marginTop: '15@ms',
  },
  headerText: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
  },
  subHeader: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
  },
  formView: {
    marginTop: '35@ms',
    marginBottom: '5@ms',
    marginRight: '10@ms',
    marginLeft: '10@ms',
  },
  info: {
    marginBottom: '20@ms',
  },
  processingText: {
    marginLeft: '10@ms',
    fontSize: '20@ms',
    fontFamily: 'Roboto-Regular',
    color: '#27a587',
    alignSelf: 'center',
  },
})

const mapStateToProps = state => {
  const { messages,  } = state.payment
  const { tosAccepted, idSubmitted, personalInfoSubmitted } = state.profile
  const { defaultMethod, externalCard, externalBank } = state.coach

  return {
    messages,
    tosAccepted,
    idSubmitted,
    personalInfoSubmitted,
    defaultMethod,
    externalCard,
    externalBank,
  }
}

export default connect(mapStateToProps, {saveCoachCard, saveBank, fetchSubmittedDocs, fetchExternalCard, fetchMethod, changeDefaultMethod})(CoachPayment);
