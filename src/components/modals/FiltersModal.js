import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import {
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';
import VPStatusBar from './VPStatusBar';
import {
  Counter,
  TextLine,
} from '../containers';
import { CachedImage } from 'react-native-cached-image';

class FiltersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      keywords: props.keywords,
      rating: props.rating,
      name: props.name,
      zipcode: props.zip,
      distance: props.distance.toString(),
      subject: props.subject,
    }
  }

  toggleVisible = () => {
    this.props.toggleVis(false);
  }

  onSearch = () => {
    let { name, rating, keywords, zipcode, distance, subject } = this.state
    
    let params = {
      rating,
      name,
      keywords,
      zipcode,
      distance,
      subject
    }
    this.props.onSearch(params);
    this.toggleVisible();
  }

  renderLocation() {
    const { softHeader, inputStyle, distanceStyle} = styles

    return (
      <View>
          <Text style={softHeader}>Location</Text>
          <TextLine
            text={this.props.zip}
            placeholder="Zipcode"
            typed={(text) => this.setState({ zip: text })}
            containerStyle={inputStyle}
            inputStyle={{width: moderateScale(300)}}
          />
          <Text style={softHeader}>Distance (miles)</Text>
          <TextLine
            text={this.state.distance}
            placeholder="5"
            typed={(text) => this.setState({ distance: text })}
            containerStyle={distanceStyle}
            inputStyle={{width: moderateScale(100)}}
          />
      </View>
    )
  }

  renderFilters() {
    const { softHeader, fineText, inputStyle} = styles
    return (
      <View style={{marginTop: moderateScale(20)}}>
        <Text style={softHeader}>Rating</Text>
          <Counter
            count={this.state.rating}
            variable=" Stars"
            countChanged={(count) => this.setState({ rating: count })}
            max={5}
          />

        <Text style={softHeader}>Subject</Text>
          <TextLine
            text={this.state.subject}
            placeholder="Geometry"
            typed={(text) => this.setState({ subject: text })}
            containerStyle={inputStyle}
            inputStyle={{width: moderateScale(300)}}
          />          

        <Text style={softHeader}>Name</Text>
          <TextLine
            text={this.state.name}
            placeholder="Sam"
            typed={(text) => this.setState({ name: text })}
            containerStyle={inputStyle}
            inputStyle={{width: moderateScale(300)}}
          />

          {this.renderLocation()}

        <Text style={softHeader}>Keywords <Text style={fineText}>(separate with comma)</Text></Text>
          <TextLine
            text={this.state.keywords}
            placeholder="homework, college apps, etc.."
            typed={(text) => this.setState({ keywords: text })}
            containerStyle={inputStyle}
            inputStyle={{width: moderateScale(300)}}
          />

      </View>
    )
  }

  renderSaveBtn() {
    const { saveBtn, btnText } = styles
    return (
      <TouchableOpacity style={saveBtn} onPress={this.onSearch}>
        <Text style={btnText}>Apply Filters</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { container, xContainer, xImg, modal, header } = styles;
    return (
      <Modal
        visible={this.state.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <VPStatusBar backgroundColor="#fff" barStyle="dark-content"/>

        <View style={modal}>
          <TouchableOpacity style={xContainer} onPress={this.toggleVisible}>
            <CachedImage
              source={require('../../../assets/icons/x.png')}
              style={xImg}
            />
            <Text style={header}>Filter</Text>
          </TouchableOpacity>

          <ScrollView style={container}>
            {this.renderFilters()}
            {this.renderSaveBtn()}
          </ScrollView>


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

  },
  xContainer: {
    margin: '10@ms',
    width: '150@ms',
    flexDirection: 'row',
  },
  xImg: {
    width: '30@ms',
    height: '30@ms',
    marginRight: '20@ms',
  },
  header: {
    fontSize: '25@ms',
    color: 'dimgrey',
    fontFamily: 'Montserrat-Medium',
    marginLeft: '15@ms',
  },
  softHeader: {
    fontSize: '22@ms',
    fontFamily: 'Montserrat-Medium',
    color: 'dimgrey',
    marginBottom: '10@ms',
    marginLeft: '15@ms',
    marginTop: '5@ms',
  },
  fineText: {
    fontSize: '16@ms',
    fontFamily: 'Roboto-Medium',
    color: 'dimgrey',
    marginBottom: '10@ms',
    marginLeft: '15@ms',
  },
  saveBtn: {
    width: '250@ms',
    backgroundColor: '#314855',
    padding: '4@ms',
    alignSelf: 'center',
    marginTop: '30@ms',
    marginBottom: '20@ms',
  },
  btnText: {
    color: '#fff',
    fontSize: '23@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
  },
  inputStyle: {
    marginLeft: '15@ms',
    marginBottom: '10@ms',
    marginRight: '30@ms',
  },
  distanceStyle: {
    width: "100@ms",
    marginLeft: '15@ms',
    marginBottom: '10@ms',
    marginRight: '30@ms',
  },
})

export { FiltersModal };
