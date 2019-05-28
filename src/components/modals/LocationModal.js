import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
import {
  AutoCompleteInput,
} from '../complexContainers'
import VPStatusBar from './VPStatusBar';
import { CachedImage } from 'react-native-cached-image';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';

class LocationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationTyped: this.props.params.city,
      subjectTyped: this.props.params.subject,
      schoolTyped: this.props.params.school,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.subjectTyped) {
      console.log(nextProps.subjectTyped)
    }
  }

  toggleVisible = () => {
    this.props.toggleVis();
  }

  onSearch = () => {
    let school = this.state.schoolTyped
    let city = this.state.locationTyped
    let subject = this.state.subjectTyped
    let params = {school, city, subject}
    let filter = `subject:${subject}`
    this.toggleVisible()
    this.props.search(filter, params)
  }

  onTyped = (text, field) => {
    this.setState({ [field]: text })

    switch (field) {
      case 'locationTyped':
        this.props.autoComplete(text, 'city')
        break;
      case 'subjectTyped':
        this.props.autoComplete(text, 'subject')
        break;
      case 'schoolTyped':
        this.props.autoComplete(text, 'highSchool')
        break;
      default:
    }
    // this.props.autoComplete()
  }

  renderLocation() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.softHeader}>Location</Text>
        <AutoCompleteInput
          typed={(text) => this.onTyped(text, 'locationTyped')}
          placeholder="City"
          text={this.state.locationTyped}
          results={this.props.results}
        />
      </View>
    )
  }

  renderSchool() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.softHeader}>School</Text>
        <AutoCompleteInput
          typed={(text) => this.onTyped(text, 'schoolTyped')}
          placeholder="School"
          text={this.state.schoolTyped}
          results={this.props.results}
        />
      </View>
    )
  }

  renderSubject() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.softHeader}>Subject</Text>
        <AutoCompleteInput
          typed={(text) => this.onTyped(text, 'subjectTyped')}
          placeholder="Biology"
          text={this.state.subjectTyped}
          results={this.props.results}
        />
      </View>
    )
  }

  render() {
    const { modal, container, search, } = styles;

    return (
      <Modal
        visible={this.state.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
      <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={modal}>
          <View style={container}>

            <TouchableOpacity style={styles.xContainer} onPress={this.toggleVisible}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>

            <KeyboardAwareScrollView>
              {this.renderSubject()}
              {this.renderLocation()}
              {this.renderSchool()}

              <TouchableOpacity style={styles.searchBtn} onPress={this.onSearch}>
                <Text style={search}>Search</Text>
              </TouchableOpacity>

            </KeyboardAwareScrollView>
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
  textInput: {
    width: '300@ms',
    height: '30@ms',
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
    margin: '3@ms',
  },
  softHeader: {
    fontFamily: 'Montserrat-Medium',
    fontSize: '23@ms',
    color: 'dimgrey',
  },
  inputContainer: {
    margin: '15@ms',
  },
  search: {
    fontSize: '24@ms',
    fontFamily: 'Raleway-BoldItalic',
    color: '#fff',
    textAlign: 'center',
    padding: '6@ms',
    paddingLeft: '15@ms',
    paddingRight: '15@ms',
  },
  searchBtn: {
    backgroundColor: '#314855',
    alignSelf: 'center',
  },
});

export { LocationModal };
