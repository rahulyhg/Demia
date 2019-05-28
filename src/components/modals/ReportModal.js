import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { TextLine } from '../containers';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import StarRating from 'react-native-star-rating';
import { CachedImage } from 'react-native-cached-image';
import VPStatusBar from './VPStatusBar';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//used in
class ReportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      review: '',
      details: '',
    }
  }

  submitRating() {
    var submitter = this.props.user.name.split(' ');

    const title = this.state.title;
    const details = this.state.details;
    const submitted = moment().format('MMMM Do YYYY');
    const submittedBy = submitter[0];

    const rating = {
      title,
      details,
      submitted,
      submittedBy,
    }

    this.props.submit(rating)
    this.toggleVisible()
  }

  changeRating(rating) {
    this.setState({stars: rating})
  }

  toggleVisible() {
    this.props.toggleVis(false);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
      <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={styles.modal}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.xContainer} onPress={this.toggleVisible.bind(this)}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>

            <KeyboardAwareScrollView behavior="position" >

            <Text style={styles.header}>Report Abusive User</Text>

            <View style={styles.picContainer}>
              <CachedImage
                source={{uri: this.props.pic}}
                style={styles.pic}
              />
            </View>

            <Text style={styles.subHeader}>We take these reports seriously and will investigate immediately.</Text>


            <View style={styles.textBox}>
              <TextLine
                placeholder="Offense"
                typed={(text) => this.setState({title: text})}
                inputStyle={styles.titleTextLine}
              />
            </View>

            <View style={styles.textBox}>
              <TextInput
                style={styles.details}
                onChangeText={(text) => this.setState({ details: text })}
                value={this.state.details}
                multiline={true}
                numberOfLines={10}
                placeholder={"Details"}
                returnKeyType="default"
                onKeyPress={this.keyboardDown}
                autoCapitalize="sentences"
              />
            </View>

            <TouchableOpacity onPress={this.submitRating.bind(this)} >
              <Text style={styles.submitText}>Report User</Text>
            </TouchableOpacity>

            </KeyboardAwareScrollView>

          </View>
        </View>
      </Modal>
    )
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
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-Bold',
    color: 'dimgrey',
    marginLeft: '10@ms',
    alignSelf: 'center',
    textAlign: 'center',
  },
  subHeader: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '20@ms',
    alignSelf: 'center',
  },
  stars: {
    marginLeft: '50@ms',
    marginRight: '50@ms',
    marginTop: '30@ms',
    marginBottom: '10@ms',
  },
  textBox: {
    margin: '20@ms',
    marginBottom: '10@ms',
  },
  reviewTextLine: {
    height: '80@ms',
    width: '300@s',
  },
  titleTextLine: {
    width: '300@s',
  },
  submitText: {
    color: '#314855',
    fontFamily: 'Montserrat-Medium',
    fontSize: '24@ms',
    alignSelf: 'center',
  },
  pic: {
    width: '70@ms',
    height: '70@ms',
    borderRadius: '35@ms',
    alignSelf: 'center',
  },
  picContainer: {
    justifyContent: 'center',
    marginTop: '30@ms',
    borderWidth: '4@ms',
    borderColor: '#314855',
    borderRadius: '37@ms',
    width: '74@ms',
    height: '74@ms',
    alignSelf: 'center',
  },
  details: {
    borderBottomWidth: '2@ms',
    borderColor: 'dimgrey',
    fontFamily: 'Montserrat-Regular',
    fontSize: '24@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '20@ms',
  },
})

export { ReportModal }
