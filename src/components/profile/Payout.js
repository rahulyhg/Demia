import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Alert,
} from 'react-native';
import {
  Block,
  BackNavBar,
  Spinner,
} from '../common';
import { HistoryCard } from '../containers';
import {
  fetchLessonHistory,
  payout,
  makeConnectAccount,
} from '../../actions'
import { connect } from 'react-redux';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
var _ = require("lodash")

class Payout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getPaid: true,
      empty: false,
      practices: [],
      balance: 0,
      loading: false,
    }
  }

  componentDidMount() {
    this.props.fetchLessonHistory()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.practicesInfo) {
      // console.log('practicesIn fo: ', nextProps.practicesInfo)
      const { empty, practices } = nextProps.practicesInfo
      const balance = practices.length * 15
      this.setState({ empty, practices, balance })
    }
    if (nextProps.loading) {
      console.log('loading')
      this.setState({ loading: nextProps.loading })
    }
  }

  alertTransfer() {
    Alert.alert('Funds have been transfered')
  }

  onTransferFunds = () => {
    this.setState({ loading: true })
    const practices = this.state.practices
    const amount = this.state.balance + '00'
    console.log(amount)
    var docIds = []
    _.forEach(practices, (practice) => {
      docIds.push(practice.docId)
    })
    this.props.payout(amount, docIds)

    setTimeout(() => this.setState({ loading: false}), 4000)
  }

  onMakeAccount = () => {
    this.props.makeConnectAccount()
  }

  renderNavBar() {
    return (
      <BackNavBar
        titleViewStyle={{ marginLeft: scale(-47) }}
        style={{backgroundColor: '#4F6D7A', shadowOpacity:0, marginBottom: 0}}
        backArrow={require('../../../assets/icons/whiteBackArrow.png')}
      />
    )
  }

  renderTransferBtn() {
    if (this.state.loading) {
      return (
        <View style={styles.spinner}>
          <Spinner color="#fff"/>
        </View>
      )
    } else if (this.state.balance > 0) {
        return (
          <View>
            <TouchableOpacity onPress={this.onTransferFunds} style={styles.paidBtn}>
              <Text style={styles.btnText}>Transfer Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onMakeAccount} style={styles.paidBtn}>
              <Text style={styles.btnText}>Make Account</Text>
            </TouchableOpacity>
          </View>
        )
      }
  }

  renderBalance() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Current Balance</Text>
        <Text style={styles.balance}>${this.state.balance}</Text>
        {this.renderTransferBtn()}
        <Text style={styles.info}>Updated balance will apprear within 24 hours of scheduled lesson.</Text>
      </View>
    )
  }

  paymentHistory() {
    return (
      <ScrollView style={{flex: 1}}>
        <FlatList
          data={this.state.practices}
          renderItem={({ item }) => (
            <HistoryCard
              name={item.user.parentName}
              date={item.formattedDate}
              paid={item.paid}
             />
          )}
          keyExtractor={ item => item.id.toString() }
        />
      </ScrollView>
    )
  }

  render() {
    return (
      <Block>
        {this.renderNavBar()}
        {this.renderBalance()}
        {this.paymentHistory()}
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  header: {
    backgroundColor: '#4F6D7A',
  },
  headerText: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: '#fff',
    alignSelf: 'center',
  },
  paidBtn: {
    height: '40@ms',
    backgroundColor: '#fff',
    borderColor: '#27a587',
    borderRadius: '5@ms',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '15@ms',
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  btnText: {
    textAlign: 'center',
    color: '#4BB49B',
    alignSelf: 'center',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: '5@ms',
    marginRight: '5@ms',
  },
  balance: {
    fontFamily: 'Montserrat-Medium',
    fontSize: '30@ms',
    color: '#fff',
    alignSelf: 'center',
  },
  spinner: {
    height: '40@ms',
    marginTop: '15@ms',
  },
  info: {
    color: '#fff',
    fontSize: '19@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
    margin: '10@ms',
  }
})

const mapStateToProps = state => {
  const { practicesInfo, empty, loading } = state.coach

  return {
    practicesInfo,
    empty,
    loading,
  }
}

export default connect(mapStateToProps, {fetchLessonHistory, payout, makeConnectAccount})(Payout);
