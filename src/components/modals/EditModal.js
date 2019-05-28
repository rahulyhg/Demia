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
} from '../common';
import { TextBox, UnscheduledCard } from '../containers';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import moment from 'moment'
class EditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: props.showModal,
      formattedDate: this.props.formattedDate,
      location: 'Map Location',
      notes: '',
      isDateTimePickerVisible: false,
      practice: {},
    }
  }

  componentDidMount() {
    console.log('edit modal mounted', this.props.practice.coachId);

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

  edit() {
    if (this.state.date != '') {
      const date = this.state.date;
      const id = this.props.practice.id;
      const coachId = this.props.practice.coachId;
      const formattedDate = this.state.formattedDate;
      const notes = this.props.practice.notes;
      const practice = this.props.practice;

      this.props.closeModal();
      this.props.editPractice(id, date, coachId, formattedDate, notes, practice);
    }
  }

  getData(text) {
    this.setState({notes: text});
  }

  render() {
    return (
      <Modal
        visible={this.state.showModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <TouchableWithoutFeedback onPress={this.onCloseModal.bind(this)}>
          <View style={styles.containerStore}>
            <View style={styles.container}>
              <UnscheduledCard
                athlete={this.props.practice.athlete.athleteName}
                sport={this.props.practice.lesson.sport}
                coach={this.props.practice.coach}
                color={{marginLeft: 10}}
              />
              <View style={styles.textContainer}>
                <TextBox placeholder='Notes for practice' text={this.props.practice.notes} typed={(text) => this.getData(text)}/>
              </View>

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
                  onPress={() => this.edit()}
                >Reschedule</GreenBtn>
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
          date={this.props.date}
        />
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  containerStore: {
    flex: 1,
    backgroundColor: '#rgba(12,12,12,0.5)',
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
  }
})

export { EditModal };
