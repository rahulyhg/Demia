import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {
  BackNavBar,
  Spinner,
} from '../common';
import {
  DocumentCard,
} from '../containers';
import {
  sendPhotoId,
  saveDoc,
 } from '../../actions';
import { connect } from 'react-redux';
import {
  scale,
  moderateScale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters'
var ImagePicker = require('react-native-image-picker');
import { ImgUpload } from '../../util/ImageUpload';
import firebase from 'react-native-firebase';

class TakePic extends Component {
  constructor(props) {
    super(props)

    this.state = {
      front: false,
      back: false,
      loading: false,
    }
  }

  componentDidMount() {
    console.log('state', this.state.back, this.state.front)
    if (this.props.docType == 'photoId') {
      console.log('photo id')
      this.setState({ front: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.docSubmitted) {
      this.setState({ loading: false })
      Alert.alert(
        'Your doc has been submitted and is up for review!',
        '',
        [
          {text: 'Great!', onPress: () => Actions.pop()}
        ],
        { cancelable: false }
      )
    }
    if (nextProps.docSubmittedFailed) {
      this.setState({ loading: false })
      Alert.alert('There was an error submitting your doc. Please try again or contact support')
    }
  }

  openCamera() {
    this.takePic()
  }

  takePic() {
    var options = {
      title: 'Take Picture',
      storageOptions: {
        skipBackup: true,
        }
    };
    setTimeout(() => this.setState({ loading: true }), 2000)
    ImagePicker.showImagePicker(options, (response)  => {
      if (response.error) {
        this.setState({ loading: false })
        return Alert.alert('Please check your camera permisions')
      } else if (response.didCancel) {
        this.setState({ loading: false })
      } else {
        this.sendPhoto(response)
      }
    })
  }

  sendPhoto(response) {
    const uri = response.uri
    const title = this.props.title
    //uploads to fb stoarage and returns url for doc storage
    ImgUpload(uri, title).then((url) => {
      const documentInfo = {
        docType: this.props.docType,
        docURL: url,
      }
      console.log('document', documentInfo)
      this.props.saveDoc(documentInfo)
      if (this.props.docType == 'photoId' && this.state.front == true) {
        this.setState({ back: true, front: false })
        setTimeout(() => this.takePic(), 500)
      }
      this.setState({ loading: false })
    }).catch((err) => {
      console.log(err)
      this.setState({ loading: false })
    })
  }

  renderMessage() {
    const { subHeader } = this.props
    const { back } = this.state
    const backOfPhotoId = 'Please send a photo of the back of your government issued id';

    if (this.state.loading) {
      return (
        <View style={styles.spinner}>
          <Spinner />
        </View>
      )
    } else {
      return (
        <Text style={styles.subHeader}>{ back == false? subHeader : backOfPhotoId }</Text>
      )
    }
  }

  render() {
    const { header, subHeader } = this.props
    const { back } = this.state
    const backOfPhotoId = 'Please send a photo of the back of your government issued id';

    return (
      <View style={styles.container}>

        <BackNavBar />

        <View style={styles.info}>
          <Text style={styles.header}>{header}</Text>
          {this.renderMessage()}
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => this.openCamera()}>
          <Text style={styles.footerText}>Take Photo</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFAE7',
    flex: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: '22@ms',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
    margin: '10@ms',
    color: 'dimgrey',
  },
  subHeader: {
    fontSize: '18@ms',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    margin: '10@ms',
    color: 'dimgrey',
  },
  footer: {
    backgroundColor: '#314855',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: '22@ms',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Raleway-BoldItalic',
    margin: '10@ms',
    color: '#fff',
  },
  spinner: {
    margin: '10@ms',
  },
})

const mapStateToProps = state => {
  const { error, message } = state.auth
  const { loading, docSubmitted, docSubmittedFailed } = state.coach

  return {
    error,
    message,
    loading,
    docSubmitted,
    docSubmittedFailed
  }
}

export default connect(mapStateToProps, { sendPhotoId, saveDoc })(TakePic);
