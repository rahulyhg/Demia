import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  FooterBtn,
  NavBar,
  Block,
  DropdownButton,
  SignupSection,
  GreenBtn,
  Section,
} from '../common';
import { TextBox, CoachPracticeCard } from '../containers';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

class RescheduleModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: props.showModal,
      formattedDate: this.props.formattedDate,
      location: 'Map Location',
      requestNotes: '',
      isDateTimePickerVisible: false,
      coach: 'Select Coach',
      athlete: 'Athlete',
      practice: props.practice,
    }
  }

   _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    var formattedDate = moment().format("MM/DD/YYYY h:mm a")
    this.setState({formattedDate: `${formattedDate}`, date: date})
    this._hideDateTimePicker();
  };

  onCloseModal() {
    this.setState({ showModal: false });
    this.props.closeModal();
  }

  onSchedule(item) {
    this.setState({ practice: item, showModal: !this.state.showModal });
    //give to props to send to parent
  }

  schedule() {
    if (this.state.date != '') {
      const date = this.state.date;
      const id = this.state.practice.id;
      const coachId = this.state.practice.coachId;
      const formattedDate = this.state.formattedDate;
      const practice = this.state.practice;
      const notes = this.state.requestNotes;

      this.props.request(date, formattedDate, notes, practice);
      this.onCloseModal();
    }
  }

  getData(text) {
    this.setState({requestNotes: text});
  }

  render() {
    const { containerStore, container } = styles;
    return (
      <Modal
        visible={this.state.showModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <TouchableWithoutFeedback onPress={this.onCloseModal.bind(this)}>
          <View style={containerStore}>
            <View style={container}>

              <CoachPracticeCard
                athlete={this.props.practice.athlete.athleteName}
                sport={this.props.practice.lesson.sport}
                formattedDate={this.props.formattedDate}
                location={this.props.location}
                color={{marginLeft: 10}}
              />

{/*                <View style={styles.textContainer}>
                  <Text style={styles.practiceInfo}>{this.state.requestNotes}</Text>
                </View>*/}
              <View style={styles.textContainer}>
                <TextBox
                  placeholder='Request notes'
                  text={this.state.requestNotes}
                  typed={(text) => this.getData(text)}
                />
              </View>
{/*              <SignupSection >
                <DropdownButton
                  onPress={() => this.mapLocation()}
                  imgURL={require('../../../assets/icons/greyMarker.png')}
                  style={{borderColor: 'dimgrey'}}
                  text={{color: 'dimgrey'}}
                >{this.state.location}</DropdownButton>
              </SignupSection>*/}

              <SignupSection >
                <DropdownButton
                  onPress={this._showDateTimePicker}
                  imgURL={require('../../../assets/icons/greySchedule.png')}
                  style={{borderColor: 'dimgrey'}}
                  text={{color: 'dimgrey'}}
                >
                  {this.state.formattedDate}
                </DropdownButton>
              </SignupSection>


              <SignupSection >
                <GreenBtn
                  onPress={() => this.schedule()}
                >Request</GreenBtn>
              </SignupSection>

            </View>
          </View>
        </TouchableWithoutFeedback>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
          minuteInterval={30}
          minimumDate={this.state.minDate}
        />
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  containerStore: {
    backgroundColor: '#rgba(12,12,12,0.5)',
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    marginTop: '150@ms',
    paddingRight: '10@s',
    paddingLeft: '10@ms',
    paddingBottom: '10@s',
    paddingTop: '10@s',
  },
  textContainer: {
    margin: '10@ms',
  },
  practiceInfo: {
    fontSize: '18@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
  },
})

export { RescheduleModal };
