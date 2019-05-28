import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  WebView,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Block,
  BackNavBar,
} from '../common';
import {
  acceptTos,
} from '../../actions'
import { ScaledSheet, scale, } from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';

class TermsOS extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tosURL: 'https://stripe.com/us/connect-account/legal',
      showTerms: false,
    }
  }

  onAcceptTerms = () => {
    this.props.acceptTos()
    Actions.popTo('coachPayment')
  }

  onToggleTerms = () => {
    this.setState({ showTerms: !this.state.showTerms })
  }

  openTerms = () => {
    Linking.openURL('http://www.varsityprep.com/terms-and-policies/')
    .catch((err) => console.log('err', err))
  }

  renderTermsTitle() {
    return (
      <TouchableOpacity onPress={this.openTerms} style={styles.termsSheet}>
        <Text style={styles.title}>Show Terms of Service Agreement</Text>
      </TouchableOpacity>
    )
  }

  renderTermsBtn() {
    return (
      <TouchableOpacity onPress={this.onAcceptTerms} style={styles.acceptBtn}>
        <Text style={styles.btnText}>I Accept</Text>
      </TouchableOpacity>
    )
  }

  renderNavBar() {
    return (
      <BackNavBar
        titleViewStyle={{marginLeft: scale(-47)}}
      />
    )
  }

  render() {
    return (
      <Block>
        {this.renderNavBar()}
        <ScrollView style={{flex: 1}}>

          <View style={styles.header}>
            <Text style={styles.headerText}>Accept Terms of Service</Text>
          </View>

          {this.renderTermsTitle()}
          {this.renderTermsBtn()}
        </ScrollView>
      </Block>
    );
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
  termsSheet: {
    borderBottomWidth: '2@ms',
    borderColor: 'dimgrey',
    margin: '10@ms',
  },
  acceptBtn: {
    borderColor: '#EA4900',
    borderRadius: '6@ms',
    borderWidth: '2@ms',
    margin: '20@ms',
    marginLeft: '50@ms',
    marginRight: '50@ms',
  },
  btnText: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '20@ms',
    color: '#EA4900',
    textAlign: 'center',
    margin: '5@ms',
  },
  title: {
    fontFamily: 'Atletico Medium',
    fontSize: '20@ms',
    color: '#EA4900',
    textAlign: 'center',
  }
})

const mapStateToProps = state => {
  const { loading } = state.auth

  return {
    loading,
  }
}

export default connect(mapStateToProps, {acceptTos})(TermsOS);
