import React, { Component } from 'react';
import {
  FlatList,
} from 'react-native';
import { connect } from 'react-redux'
import {
  Block,
  NavBar,
} from '../common';
import {
  ParentCard,
} from '../containers';
import {
  ParentModal,
} from '../modals';
import {
  scale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import {
  fetchUserThreads,
} from '../../actions';

class ContactParent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parents: null,
      empty: true,
      showModal: false,
      item: {},
      showContact: false,
      parent: {},
    }
  };

  componentDidMount() {
    this.props.fetchUserThreads()
  }

  renderParents() {
    console.log(this.props.userThreads)
    const noCoaches = "Doesn't look like you've booked any practices";
    if (this.props.userThreads) {
      return (
        <FlatList
          data={this.props.userThreads}
          extraData={this.props}
          renderItem={({ item }) => (
            <ParentCard
              name={item.user.name}
              athleteName={item.user.currentPrep.nickname}
              showContactCard={() => this.setState({ showContact: !this.state.showContact, parent: item})}
              contact={true}
            />
          )}
          keyExtractor={ item => item.thread }
        />
      )
    }
  }

  renderParentModal() {
    if (this.state.showContact) {
      return (
        <ParentModal
          close={() => this.setState({ showContact: false})}
          visible={this.state.showContact}
          parent={this.state.parent}
        />
      )
    }
  }

  render() {
    return (
      <Block>
          <NavBar
            title="Contact Parent"
            drawerPress={() => Actions.pop()}
            titleViewStyle={{marginLeft: scale(-10) }}
          />
          {this.renderParents()}
          {this.renderParentModal()}
      </Block>
    );
  }
}

const styles = ScaledSheet.create({
  emptyContainer: {
    borderRadius: 10,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#393939',
    shadowOpacity: .3,
    shadowRadius: 10,
    margin: '10@ms',
    paddingTop: '45@vs',
    paddingBottom: '40@vs',
    backgroundColor: '#fff',
  },
  imageStyle: {
    width: scale(65),
    height: verticalScale(65),
    alignSelf: 'center',
  },
  uhOhText: {
    color: 'dimgrey',
    fontFamily: 'Roboto-Regular',
    fontSize: '24@ms',
    margin: '20@ms',
    textAlign: 'center',
    alignSelf: 'center',
  },
  containerStore: {
    backgroundColor: '#rgba(178, 178, 178, 0.5)',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    marginTop: '250@vs',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
  },
})

const mapStateToProps = state => {
  const { loadingThreads, userThreads } = state.message

  return {
    loadingThreads,
    userThreads
  }
}

export default connect(mapStateToProps, {fetchUserThreads})(ContactParent);
