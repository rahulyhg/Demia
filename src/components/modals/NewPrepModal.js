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
  Picker,
  Alert,
} from 'react-native';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
import VPStatusBar from './VPStatusBar';
import { CachedImage } from 'react-native-cached-image';
var t = require('tcomb-form-native');
var Form = t.form.Form;
import { formStyle, splitForm } from '../../stylesheet';
import moment from 'moment'

var grades = t.enums({
  0: 'Kindergarten',
  1: 'First Grade',
  2: 'Second Grade',
  3: 'Third Grade',
  4: 'Fourth Grade',
  5: 'Fifth Grade',
  6: 'Sixth Grade',
  7: 'Seventh Grade',
  8: 'Eight Grade',
  9: 'Freshman (High School)',
  10: 'Sophomore (High School)',
  11: 'Junior (High School)',
  12: 'Senior (High School)'
})

var Prep = t.struct({
  name: t.String,
  nickname: t.String,
  dob: t.Date,
  grade: grades,
})

var options = {
  stylesheet: formStyle,
  fields: {
    name: {
      label: 'Name',
      placeholder: 'What you write on a scantron',
    },
    nickname: {
      label: 'Nickname',
      placeholder: 'What your friends call you',
      keyboardType: 'email-address',
    },
    dob: {
      label: 'Birth Day',
      placeholder: 'Tap to Select a Date',
      mode: 'date',
      config: {
        format: (date) => moment(date).format('LL'),
        defaultValueText: 'Tap to pick a date'
      }
    },
    grade: {
      label: 'Grade',
      placeholder: 'School Year/Grade',
    }
  }
}


class NewPrepModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      profile: {
        name: '',
        nickname: '',
        dob: '',
        grade: '',
      },
    }
  }

  onCreate = () => {
    const { name, nickname, dob, grade } = this.state.profile
    const prep = {
      name: name,
      nickname: nickname,
      dob: dob,
      grade: grade,
      badgeLevel: 0,
      levelPoints: 20,
    }

    let E = ''
    if (name != E && nickname != E && dob != E && grade != E) {
      this.props.onCreate(prep)
      this.props.toggleVis()
    } else {
      Alert.alert('You left a field empty')
    }
  }

  onChangeProfile = (value) => {
    this.setState({ profile: value })
  }

  render() {
    const {
      modal, container, horizBox, vertBox, search
    } = styles;
    const { profile } = this.state

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

            <TouchableOpacity style={styles.xContainer} onPress={() => this.props.toggleVis()}>
              <CachedImage
                source={require('../../../assets/icons/x.png')}
                style={styles.xImg}
              />
            </TouchableOpacity>

            <ScrollView style={{ flex: 1 }}>
              <View style={horizBox}>
                <View>
                  <Text style={styles.title}>New User</Text>
                </View>
              </View>

              <View style={styles.formView}>
                <Form
                  ref="form"
                  type={Prep}
                  options={options}
                  value={this.state.profile}
                  onChange={this.onChangeProfile}
                />
              </View>

              <TouchableOpacity onPress={this.onCreate}>
                <Text style={search}>Create</Text>
              </TouchableOpacity>

            </ScrollView>

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
  horizBox: {
    margin: '10@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vertBox: {
    margin: '10@ms',
    borderBottomWidth: '1@ms',
    borderColor: '#989898',
    paddingBottom: '30@ms',
  },
  title: {
    fontSize: '24@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
  },
  search: {
    fontSize: '24@ms',
    fontFamily: 'Montserrat-Medium',
    color: '#314855',
    textAlign: 'center',
  },
  formView: {
    margin: '25@ms',
    marginRight: '25@ms',
  },
});

export { NewPrepModal };
