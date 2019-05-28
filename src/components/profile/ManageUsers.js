import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native'
import {
  Block,
  BackNavBar,
} from '../common';
import {
  ActiveUserCard,
  EmptyCard,
} from '../containers';
import {
  NewPrepModal,
} from '../modals';
import { connect } from 'react-redux';
import {
  fetchPreps,
  querySchoolsByCity,
  queryAllSchools,
  createPrep,
  switchPrep,
  fetchCurrentPrep,
} from '../../actions';
import { ScaledSheet, scale, } from 'react-native-size-matters'

class ManageUsers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      createNewPrep: false,
      empty: true,
    }
  }

  componentDidMount() {
    this.props.fetchPreps()
    this.props.queryAllSchools()
    this.props.fetchCurrentPrep()
  }

  onToggleCreatePrep() {
    this.setState({ createNewPrep: !this.state.createNewPrep })
  }

  onSwitchPrep = (prep) => {
    this.props.switchPrep(prep)
  }

  renderPreps() {
    if (this.props.preps.length > 0) {
      return (
        <FlatList
          data={this.props.preps}
          extraData={this.props}
          renderItem={(item) =>
            <ActiveUserCard pressed={this.onSwitchPrep} activePrep={item} currentPrep={this.props.currentPrep} />
          }
          keyExtractor={(item) => item.prepUid }
        />
      )
    }
  }

  renderNewPrepModal() {
    if (this.state.createNewPrep) {
      return (
        <NewPrepModal
          toggleVis={() => this.onToggleCreatePrep()}
          schools={this.props.schoolInfo.schools}
          visible={this.state.createNewPrep}
          onCreate={(prep) => this.props.createPrep(prep)}
        />
      )
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar
          title="Users"
          titleViewStyle={{ marginLeft: scale(-60) }}
        />
        <Text style={styles.header}>Create and manage users</Text>

        <ActiveUserCard pressed={() => this.onToggleCreatePrep()}/>
        {this.renderPreps()}

        {this.renderNewPrepModal()}
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '33@ms',
    color: 'dimgrey',
    marginLeft: '4@ms',
  },
})

const mapStateToProps = state => {
  const { users, empty, schoolInfo, preps, currentPrep } = state.profile

  return {
    users,
    empty,
    schoolInfo,
    preps,
    currentPrep,
  }
}

const actions = {fetchPreps, fetchCurrentPrep, createPrep, switchPrep, queryAllSchools, querySchoolsByCity}
export default connect(mapStateToProps, actions) (ManageUsers);
