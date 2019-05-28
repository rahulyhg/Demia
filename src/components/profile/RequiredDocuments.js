import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native'
import {
  BackNavBar,
} from '../common';
import {
  DocumentCard,
} from '../containers';
import {
  saveDoc,
} from '../../actions';
import { connect } from 'react-redux'
import {
  scale,
  moderateScale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters'
var ImagePicker = require('react-native-image-picker');
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';


class RequiredDocuments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      peerSubmitted: false,
      parentSubmitted: false,
    }
  }

  componentDidMount() {
    this.fetchSubmittedDocs()
  }

  fetchSubmittedDocs() {
    try {
      const user = firebase.auth().currentUser
      firebase.firestore().collection('coaches').doc(user.uid)
      .onSnapshot((snapShot) => {
        const { parentDoc, counselorDoc } = snapShot.data()
        const peerSubmitted = counselorDoc? true: false;
        const parentSubmitted = parentDoc? true: false;
        this.setState({ peerSubmitted, parentSubmitted })
      })
    } catch(err) {
      console.log('err', err)
    }
  }

  alertDeletion() {
    Alert.alert(
      'Wait',
      'Are you sure you want to delete your submitted document. It will be removed from your mentor profile.',
      [
        {text: 'No Thanks', onPress: () => console.log('cancelled'), style: 'cancel'},
        {text: "I'm sure", onPress: () => this.deleteDoc()},
      ],
      { cancelable: false }
    )
  }

  onRetakePhoto(header, subHeader, title, docType) {
    Alert.alert(
      'You already submitted this approval letter',
      'Are you sure you want to resubmit it?',
      [
        {text: 'No Thanks', style: 'cancel'},
        {text: "I'm sure", onPress: () => Actions.takePic({ header, subHeader, title, docType })},
      ],
      { cancelable: false }
    )
  }

  renderRecomendation() {
    const header = "Superior/Counselor/Instructor Letter"
    const subHeader = "Please send us a clear picture of a letter from a superior/conselor/instructor expressing their concent and approval to be an excellent mentor."
    const title = "counsel"
    const docType = "counselorDoc"
    return (
      <DocumentCard
        text="Peer Recomendation"
        takePicture={() => Actions.takePic({ header: header, subHeader: subHeader, title: "counsel", docType: 'counselorDoc' })}
        taken={this.state.peerSubmitted}
        retake={() => this.onRetakePhoto( header, subHeader, title, docType )}
      />
    )
  }

  renderParentLetter() {
    const header = "Parent/Guardian Letter"
    const subHeader = "Please send us a clear picture of a letter from your parent or guardian expressing their concent and approval to be an excellent mentor."
    const title = "parent"
    const docType = "parentDoc"
    return (
        <DocumentCard
          text="Parent/Guardian Recomendation"
          takePicture={() => Actions.takePic({ header: header, subHeader: subHeader, title: "parent", docType: 'parentDoc' })}
          taken={this.state.parentSubmitted}
          retake={() => this.onRetakePhoto(header, subHeader, title, docType)}
        />
    )
  }

  renderNav() {
    return (
      <BackNavBar
        titleViewStyle={{ marginLeft: scale(-47) }}
      />
    )
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderNav()}
          <ScrollView style={{flex: 1}}>
            <Text style={styles.header}>Required Documents</Text>

            <Text style={styles.subHeader}>Parent Aproval Letter</Text>
            <Text style={styles.infoText}>This is a letter expressing approval from your parent/guardian to be an excellent mentor.</Text>
            {this.renderParentLetter()}

            <Text style={styles.subHeader}>Counselor Aproval Letter</Text>
            <Text style={styles.infoText}>This is a letter expressing approval from a coach, trainer, instructor, or teacher to be an excellent mentor.</Text>
            {this.renderRecomendation()}
          </ScrollView>
        </View>
    )
  }

  componentWillUnmount() {
    const user = firebase.auth().currentUser
    firebase.firestore().collection('coaches').doc(user.uid)
    .onSnapshot(() => {})
  }
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: '#FFFBEF',
    flex: 1,
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: '30@ms',
    color: 'dimgrey',
    marginLeft: '10@ms',
  },
  subHeader: {
    fontFamily: 'Roboto-Medium',
    fontSize: '23@ms',
    color: 'dimgrey',
    marginLeft: '10@ms',
    marginTop: '20@ms',
  },
  infoText: {
    fontSize: '18@ms',
    color: 'dimgrey',
    marginLeft: '10@ms',
  },
})

const mapStateToProps = state => {
  const { loading } = state.coach

  return {
    loading,
  }
}

export default connect( mapStateToProps,{saveDoc}) (RequiredDocuments);
