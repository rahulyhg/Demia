import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  FlatList,
} from 'react-native'
import {
  Block,
  NavBar,
  SignupSection,
  SelectedBtn,
} from '../common';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import {CachedImage} from 'react-native-cached-image'
const _ = require('lodash');

class SessionForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      subject: '',
      zip: this.props.zip,
    }
  }

  onEdit = (t) => {
    this.props.autoComplete(t)
    this.setState({ subject: t })

  }

  onSelect = (title) => {
    this.setState({ subject: title })
    this.props.autoComplete(' ')
    this.props.subjectTyped(title)
  }

  onZipTyped = (z) => {
    this.props.zipTyped(z)
  }

  onCompleteZip = () => {
    this.props.getZip()
  }

  renderResults() {
    if (this.props.results.length > 0) {
      return (
        <View>
          <FlatList
            data={this.props.results}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.onSelect(item.title)}>
                <Text style={styles.results}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )
    }
  }

  render() {
    //use blur and focus to restric state changes
    return (
      <View style={styles.container}>

        <Text style={styles.header}> Find a great mentor </Text>

        <View style={styles.inputHolder}>
          <Image
            source={require('../../../assets/icons/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={`Subject`}
            placeholderTextColor="dimgrey"
            onChangeText={(t) => this.onEdit(t)}
            autoCorrect={false}
            value={this.state.subject}
          />
        </View>
        {this.renderResults()}


        <View style={{flexDirection: 'row'}}>
          <View style={styles.ih}>
            <TextInput
              style={styles.input}
              placeholder={`Zip Code`}
              placeholderTextColor="dimgrey"
              onChangeText={(t) => this.onZipTyped(t)}
              value={this.props.zip}
              keyboardType="numeric"
              textContentType="postalCode"
            />
          </View>
          <TouchableOpacity onPress={this.onCompleteZip} style={styles.imgContainer}>
              <CachedImage source={require('../../../assets/icons/address.png')} style={styles.img}/>
          </TouchableOpacity>
        </View>


      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '10@ms',
  },
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
    marginBottom: '10%',
  },
  input: {
    height: '30@ms',
    marginLeft: '5@ms',
    fontSize: '24@ms',
    margin: '4@ms',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  ih: {
    margin: '3@ms',
    borderColor: '#314855',
    borderWidth: '1@ms',
    borderRadius: '4@ms',
    marginTop: '10@ms',
    width: '120@ms',
    backgroundColor: '#FFFBEF',
    shadowRadius: '4@ms',
    shadowOpacity: .5,
    shadowColor: 'dimgrey',
    shadowOffset: {width: 3, height: 3}
  },
  inputHolder: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEF',
    margin: '3@ms',
    borderColor: '#314855',
    borderWidth: '1@ms',
    borderRadius: '4@ms',
    marginTop: '10@ms',
    shadowRadius: '4@ms',
    shadowOpacity: .5,
    shadowColor: 'dimgrey',
    shadowOffset: {width: 3, height: 3}
  },
  searchIcon: {
    width: '23@ms',
    height: '23@ms',
    alignSelf: 'center',
    marginLeft: '4@ms',
  },
  results: {
    height: '30@ms',
    marginLeft: '5@ms',
    fontSize: '24@ms',
    margin: '4@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
  },
  img: {
    width: '35@ms',
    height: '35@ms',
    marginLeft: '10@ms',
  },
  imgContainer: {
    justifyContent: 'center',
    paddingTop: '12@ms',
  } 
})

export { SessionForm };
