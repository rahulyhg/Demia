import React, { Component } from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
import {
  DropdownButton,
  SignupSection,
  GreenBtn,
} from '../common';
import {
  schedulePractice,
} from '../../actions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { UnscheduledCard } from '../containers';
import moment from 'moment'

class ScheduleModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDateTimePickerVisible: false,
      date: 'Date',
      scheduled: false,
    };
  }

  componentDidMount() {
    this.setState({date: this.props.date});
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    var formattedDate = moment(date).format("MM/DD/YYYY h:mm a")
    this.setState({date: `${formattedDate}`})
    this._hideDateTimePicker();
  };

  schedule() {
    if (this.state.date != 'Date') {
      const date = this.state.date
      const id = this.props.id;
      const coach = this.props.coachId;

      this.props.schedulePractice(id, date, coach);
      if (this.props.loading == false) {
        this.setState({ showModal: false });
        this.props.onAccept
      }
    }
  }

  render() {
    const { sport, coach, scheduleBtn, athlete, visible, onAccept, onDecline, onClose, date } = this.props;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <TouchableWithoutFeedback onPress={onAccept}>
          <View style={containerStore}>
            <View style={container}>
              <UnscheduledCard
                athlete={athlete}
                sport={sport}
                coach={coach}
                color={{marginLeft: 10}}
              />
              <SignupSection >
                <DropdownButton
                  onPress={this._showDateTimePicker}
                  imgURL={require('../../../assets/icons/greySchedule.png')}
                  style={{borderColor: 'dimgrey'}}
                  text={{color: 'dimgrey'}}
                >
                  {this.state.date}
                </DropdownButton>
              </SignupSection>

              <SignupSection >
                <GreenBtn
                  onPress={() => this.schedule()}
                >Schedule</GreenBtn>
              </SignupSection>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />
      </Modal>
    );
  }
};


export const styles = ScaledSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  scheduleBtn: {
    backgroundColor: '#fff',
    marginLeft: '30@s',
    marginRight: '10@s',
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    marginTop: '10@s',
  },
  scheduleText: {
    fontSize: '17@ms',
    fontFamily: 'Roboto-Regular',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    margin: '10@s',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  containerStore: {
    flex: 1,
    backgroundColor: '#rgba(12,12,12,0.5)',
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
  container2: {
    backgroundColor: '#fff',
    marginLeft: '10@s',
    marginRight: '10@s',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: 'dimgrey',
    borderWidth: '2@ms',
    paddingRight: '10@s',
    paddingBottom: '10@s',
    paddingTop: '10@s',
    flex: .2,
  },
  section: {
    marginLeft: scale(13),
    marginRight: scale(13),
    borderRadius: 10,
  },
})
const { container, container2, section, scheduleText, nameContainer, containerStore, coachContainer, nameText, coachText, background } = styles;

const mapStateToProps = state => {
  const { loading, booked } = state.booking;

  return {
    loading,
    booked,
  };
}

export default connect(mapStateToProps, { schedulePractice })(ScheduleModal);
