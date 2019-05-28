import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from  'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getMentorsFromZip
} from '../../actions';
import {
  FiltersModal,
} from '../modals';
import {
  Block,
  Spinner,
} from '../common';
import {
  SpecialNavBar,
} from '../complexContainers'
import { CoachCard, EmptyCard } from '../containers';
import {
  scale,
  verticalScale,
  ScaledSheet,
} from 'react-native-size-matters';


class FindCoaches extends Component {
constructor(props) {
  super(props);

  this.state = {
    loading: false,
    error: null,
    empty: false,
    location:  '',
    subjectTitle: props.subject,
    showFilters: false,
    params: this.props.coachParams,
    keywords: '',
    rating: 0,
    name: '',
    filters: 2,
    distance: "5",
  }
}

  componentDidMount() {
    this.makeRequest();
  }

  onFilter = (params) => {
    let { rating, name, keywords, zipcode, distance, subject } = params
    let filterCount = 0;
    _.forEach(params, (par) => {
      if (par) {
        filterCount++
      }
    })

    let kw = keywords.replace(',', ' ')
    let radius = Number(distance)
    this.setState({ rating, name, keywords, filters: filterCount, subjectTitle: subject })

    let query = `${kw? kw:''} ${name? name:''}`
    let filter = `subject:${subject} AND activated=1`
    let numericFilter = [`rating >= ${rating}`]

    this.props.getMentorsFromZip(zipcode, radius, query, filter, numericFilter )
  }

  renderEmptyScreen() {
    const empty = `There aren't any mentors that match the filters given.`
    if (this.props.mentors.length < 1) {
      return (
        <EmptyCard
          text={empty}
        />
      );
    }
  }

  makeRequest() {
    const { zip, subject } = this.props

    let query = `${subject}`
    let radius = 5
    let filter = 'activated=1'
    this.setState({ filters: 3, subject, zip })
    this.props.getMentorsFromZip(zip, radius, query, filter)
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  setFilters(params) {
    const { school, city, subject } = params
    this.setState({
      location: city,
      subjectTitle: subject,
      schoolFilter: school,
    })
  }

  renderFilters() {
    if (this.state.showFilters) {
      return (
        <FiltersModal
          rating={this.state.rating}
          name={this.state.name}
          keywords={this.state.keywords}
          distance={this.state.distance}
          subject={this.state.subjectTitle}
          visible={this.state.showFilters}
          onSearch={(params) => this.onFilter(params)}
          toggleVis={() => this.setState({showFilters: !this.state.showFilters})}
          zip={this.props.zip}
        />
      )
    }
  }

  renderFilterBar() {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity style={styles.ftc} onPress={this.toggleFilters.bind(this)}>
          <View style={styles.filterNumContainer}><Text style={styles.filterNum}>{this.state.filters}</Text></View>
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  renderLoading() {
    if (this.props.loadingMentors) {
      return (
        <View style={{ marginTop: verticalScale(20) }}>
          <Spinner />
        </View>
      )
    }
  }

  renderCoach() {
    if (this.props.mentors.length > 0) {
      return (
        <View style={styles.coachContainer}>
          <FlatList
            data={this.props.mentors}
            extraData={this.props}
            renderItem={({ item }) => (
              <CoachCard
                coach={item}
                name={item.name}
                subject={item.subject}
                bio={item.experience}
                imgURL={item.picture}
                lesson={this.props.coachParam}
                uid={item.id}
                rating={item.rating}
              />
            )}
            keyExtractor={ item => item.email.toString()}
          />
        </View>
      )
    }
  }

  renderNav() {
    return (
      <View style={styles.border}>
        <SpecialNavBar
          titleViewStyle={{marginLeft: scale(-54)}}
          title="Tutors"
        />

        {this.renderFilterBar()}
      </View>
    )
  }

  render() {
    return (
      <Block>
        {this.renderNav()}
        {this.renderLoading()}
        {this.renderEmptyScreen()}
        {this.renderCoach()}
        {this.renderFilters()}
      </Block>
    );
  }
}


const styles = ScaledSheet.create({
  filterContainer: {
    flexDirection: 'row',
    marginLeft: '10@ms',
    marginBottom: '5@ms',
  },
  ftc: {
    padding: '5@ms',
    marginRight: '5@ms',
    flexDirection: 'row',
  },
  filterText: {
    fontSize: '21@ms',
    fontFamily: 'Montserrat-Medium',
    color: '#4F6D7A',
  },
  paramsText: {
    fontSize: '17@ms',
    fontFamily: 'Montserrat-Regular',
    color: '#314855',
    borderColor: '#989898',
    borderWidth: '2@ms',
    borderRadius: '10@ms',
    padding: '5@ms',
    marginRight: '8@ms',
  },
  item: {
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Regular',
    color: 'dimgrey',
  },
  coachContainer: {
    flex: 1,
  },
  filterNumContainer: {
    backgroundColor: '#1F3859',
    borderRadius: '4@ms',
    paddingLeft: '3@ms',
    paddingRight: '3@ms',
    marginRight: '3@ms',
    marginTop: '3@ms',
    alignSelf: 'baseline',
  },
  filterNum: {
    color: '#fff',
    fontSize: '17@ms',
  },
  border: {
    borderBottomColor: "#F4EBE1",
    borderBottomWidth: "2@ms",
    shadowColor: "#B2ABA4",
    shadowOpacity: .4,
    shadowOffset: {width: "1@ms", height: "2@ms"},
  }
})


const mapStateToProps = state => {
  const {
    error, empty,
  } = state.coach;
  const { 
    mentors, loadingMentors, results, autoCompleteErr, geo 
  } = state.search

  return {
    error,
    empty,
    mentors,
    loadingMentors,
    results,
    autoCompleteErr,
    geo
  }
}

export default connect(mapStateToProps, { getMentorsFromZip })(FindCoaches);
