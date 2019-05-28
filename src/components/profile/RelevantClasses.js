import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'
import { CachedImage } from 'react-native-cached-image';
import { BackNavBar, Block, } from '../common';
import { ClassCard } from '../containers';
import { basics } from '../../stylesheet';
import {
  fetchClasses,
  addClass,
  removeClass,
} from '../../actions'
var t = require('tcomb-form-native');
var Form = t.form.Form;
import {formStyle} from '../../stylesheet';
var _ = require('lodash')

var classInfo = t.struct({
  className: t.String,
  teacher: t.String,
})

var options = {
  stylesheet: formStyle,
  fields: {
    className: {
      label: 'Class Name',
      placeholder: 'AP Macro Economics',
      style: {fontSize: 23},
      returnKeyType: 'next',
      autoCorrect: false,
    },
    teacher: {
      label: 'Teacher',
      placeholder: 'Mr. Stein',
      style: {fontSize: 23},
      returnKeyType: 'next',
      autoCorrect: false,
    },
  }
}

class RelevantClasses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showClassForm: false,
      classInfo: {
        className: '',
        teacher: '',
      },
    }
  }

  componentDidMount() {
    this.props.fetchClasses()
  }

  onAddClass = () => {
    if (this.state.showClassForm && !_.isEmpty(this.state.classInfo)) {
      let classInfo = this.state.classInfo
      this.props.addClass(classInfo)
      this.setState({ showClassForm: !this.state.showClassForm, classInfo: {} })
    } else {
      this.setState({ showClassForm: !this.state.showClassForm })
    }
  }

  onToggleClassForm = () => {
    this.setState({ showClassForm: !this.state.showClassForm})
  }

  onRemoveClass = (classId) => {
    this.props.removeClass(classId)
  }

  renderAddClassBtn() {
    return (
      <TouchableOpacity style={styles.addClassBtn} onPress={this.onAddClass}>
        <Text style={styles.addBtnText}>Add Class</Text>
      </TouchableOpacity>
    )
  }

  renderClassForm() {
    if (this.state.showClassForm) {
      return (
        <KeyboardAvoidingView behavior="position">
          <Form
            ref="form"
            type={classInfo}
            options={options}
            value={this.state.classInfo}
            onChange={(value) => this.setState({ classInfo: value })}
          />
        </KeyboardAvoidingView>
      )
    }
  }

  renderClasses() {
    if (this.props.classes.length > 0) {
      return (
        <View>
          <FlatList
            data={this.props.classes}
            renderItem={({item}) => (
              <ClassCard
                teacher={item.teacher}
                className={item.className}
                removeClass={() => this.onRemoveClass(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )
    } else {
      return (
        <View>
          <Text style={styles.emptyText}>No classes yet</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Block>
        <BackNavBar />
        <View style={styles.container}>
          <Text style={styles.header}>Relevant Classes</Text>
          {this.renderClassForm()}
          {this.renderAddClassBtn()}
          {this.renderClasses()}
        </View>
      </Block>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    margin: '15@ms',
  },
  header: {
    fontSize: '30@ms',
    fontFamily: 'Montserrat-ExtraBold',
    color: 'dimgrey',
  },
  infoContainer: {
    marginTop: '15@ms',
  },
  addClassBtn: {
    margin: '25@ms',
    backgroundColor: '#314855',
    padding: '6@ms',
  },
  addBtnText: {
    color: '#fff',
    fontSize: '22@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
  },
  emptyText: {
    color: 'dimgrey',
    fontSize: '22@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
  },
})

const mapStateToProps = state => {
  const { classes } = state.coach

  return {
    classes,
  }
}

export default connect(mapStateToProps, { addClass, removeClass, fetchClasses })(RelevantClasses);
