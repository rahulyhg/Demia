import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from  'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Block,
  Section,
  SignupSection,
  IntroSection,
  BackNavBar,
} from '../common';
import {
  LessonBlock, InfoItem,
} from '../containers';
import {
  DocumentImgViewer,
} from '../complexContainers';
import {
  scale,
  ScaledSheet,
} from 'react-native-size-matters';
import {
  fetchReviews,
  fetchDocs,
  fetchRelevantClasses,
} from '../../actions';
import { ReviewsModal } from '../modals';
import FastImage  from 'react-native-fast-image';
var _ = require('lodash')

class CoachProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lessons: !props.preview,
      coach: {},
      showReviews: false,
      reviews: [],
      showDocuments: false,
      docs: [],
    };
  }

  componentDidMount() {
    if (this.props.preview) {
      this.setState({
        lesson: false
      })
    }

    const coachId = this.props.coach.id
    this.props.fetchDocs(coachId)
    this.props.fetchReviews(coachId)
    this.props.fetchRelevantClasses(coachId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.preview) {
      this.setState({ lesson: false })
    }
    if (nextProps.reviews) {
      this.setState({ reviews: nextProps.reviews })
    }
    if (nextProps.docs) {
      this.setState({ docs: nextProps.docs })
    }
  }

  toggleReviews() {
    this.setState({
      showReviews: !this.state.showReviews,
    })
  }

  toggleDocuments() {
    this.setState({ showDocuments: !this.state.showDocuments })
  }

  showReviews() {
    if (this.state.showReviews) {
      return (
        <ReviewsModal
          visible={this.state.showReviews}
          transparent={false}
          animationType="slide"
          closeModal={() => this.toggleReviews()}
          reviews={this.state.reviews}
        />
      )
    }
  }

  showMessages() {
    console.log(this.props.coach)
    Actions.messageThread({ mentor: this.props.coach, mentorId: this.props.uid })
  }

  renderLessons() {
    const user = firebase.auth().currentUser;
    if (user == null) {
      return (
        <IntroSection>
          <LessonBlock
            numOfLessons={'1'}
            price={`$${this.props.coach.sessionPrice}`}
            pressed={() => Actions.signup({numOfLessons: 1, price: '35', coach: this.props.coach, lesson: this.props.lesson, boo: true, uid: this.props.uid})}/>
        </IntroSection>
      );
    } else if (this.state.lessons) {
        return (
          <IntroSection>
            <LessonBlock
              numOfLessons={'1'}
              price={`$${this.props.coach.sessionPrice}`}
              pressed={() =>
                Actions.bookingSignup({
                  numOfLessons: 1,
                  price: this.props.coach.sessionPrice,
                  coach: this.props.coach,
                  lesson: this.props.lesson,
                  coachId: this.props.coach.id,
                  mentorPic: this.props.coach.picture,
                })
              }
            />
          </IntroSection>
        );
      }
  }

  renderClasses() {
    if (this.props.classes.length > 0) {
      return (
        <Section>
          <View style={styles.reviewBtn}>
            <Text style={styles.classesTitle}>Relevant Classes</Text>
            <FlatList
              data={this.props.classes}
              renderItem={({item}) => (
                <Text style={styles.classesInfo}>{item.className}: {item.teacher}</Text>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </Section>
      )
    }
  }

  renderDocImgs() {
    if (this.state.showDocuments) {
      return (
        <DocumentImgViewer
          docs={this.state.docs}
          docUrls={_.map(this.state.docs, 'docURL')}
        />
      )
    }
  }

  renderReviews() {
    return (
      <View>
        <Section>
          <TouchableOpacity onPress={() => this.toggleReviews()} style={styles.reviewBtn}>
            <Text style={styles.reviewText}>Mentor Reviews</Text>
          </TouchableOpacity>
        </Section>
      </View>
    )
  }

  renderMessages() {
    if (!this.props.preview) {
      return (
        <TouchableOpacity onPress={() => this.showMessages()} style={styles.msgBtn}>
          <Text style={styles.msgText}>Message Mentor</Text>
        </TouchableOpacity>
      )
    }
  }

  renderDocuments() {
    if (!_.isEmpty(this.state.docs)) {
      return (
        <Section>
          <TouchableWithoutFeedback onPress={() => this.toggleDocuments()} >
            <View style={styles.reviewBtn}>
              <Text style={styles.reviewText}>Mentor Documents</Text>
              {this.renderDocImgs()}
            </View>
          </TouchableWithoutFeedback>
        </Section>
      )
    }
  }

  render() {
    if (this.props.coach) {
      const { name, subject, sport, experience, position, reason, picture } = this.props.coach;
      return (
        <Block>
          <BackNavBar
            title={name}
            titleViewStyle={{marginLeft: scale(-44)}}
          />

          <ScrollView ref="scroll">
            <View style={styles.containerStyle}>
              <SignupSection>
                <View style={styles.profileContainer}>
                  <FastImage
                    source={{uri: picture}}
                    style={styles.imageStyle}
                  />
                </View>
              </SignupSection>

              <View style={styles.header}>
                <Text style={styles.subTitleStyle}>{subject? subject[0]: ''}</Text>
                <Text style={styles.subSubTitle}>Is my favorite subject</Text>
              </View>

              <Section>
                <InfoItem
                  title={"My Subjects"}
                  details={experience}
                />
              </Section>

              <Section>
                <InfoItem
                  title={"Why I Love Tutoring"}
                  details={reason}
                />
              </Section>

              {this.renderClasses()}
              {this.renderDocuments()}
              {this.renderReviews()}
              {this.renderMessages()}

              <SignupSection>
                {this.renderLessons()}
              </SignupSection>
            </View>
          </ScrollView>
          {this.showReviews()}
        </Block>
      );
    }
  }
}

const styles = ScaledSheet.create({
  imageStyle: {
    width: '140@ms',
    height: '140@ms',
    borderRadius: '70@ms',
  },
  profileContainer: {
    borderRadius: '70@ms',
    borderWidth: '3@ms',
    borderColor: '#314855',
    backgroundColor: 'grey',
    shadowOffset: {width: 2, height: 2},
    shadowColor: '#393939',
    shadowOpacity: .3,
  },
  nameStyle: {
    fontSize: '35@ms',
    fontFamily: 'Avenir-Medium',
    color: '#01b287',
    alignSelf: 'center',
  },
  subTitleStyle: {
    fontSize: '30@ms',
    color: 'grey',
    alignSelf: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  containerStyle: {
    paddingTop: '5@vs',
    flex: 1,
  },
  navImage: {
    width: '37@ms',
    height: '37@ms',
    padding: '10@ms',
    marginTop: '10@ms',
  },
  header: {
    justifyContent: 'center',
    marginBottom: '20@ms',
  },
  reviewBtn: {
    flex: 1,
    borderBottomWidth: '2@ms',
    borderColor: '#989898',
    paddingBottom: '10@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '17@ms',
  },
  reviewText: {
    color: '#314855',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  msgBtn: {
    flex: 1,
    borderColor: '#989898',
    paddingBottom: '10@ms',
    paddingTop: '10@ms',
    marginLeft: '10@ms',
    marginRight: '10@ms',
    marginBottom: '7@ms',
    backgroundColor: '#EA4900',
    justifyContent: 'center',
  },
  msgText: {
    color: '#fff',
    fontSize: '22@ms',
    fontFamily: 'Raleway-BoldItalic',
    textAlign: 'center',
    alignSelf: 'center',
  },
  subSubTitle: {
    color: 'dimgrey',
    fontSize: '20@ms',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  classesInfo: {
    fontSize: '20@ms',
    marginLeft: '10@s',
    marginRight: '6@s',
    color: '#686868',
    fontFamily: 'Roboto-Regular',
  },
  classesTitle: {
    fontSize: '20@ms',
    color: 'dimgrey',
    marginLeft: '10@s',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: '8@ms',
  },
});

const mapStateToProps = state => {
  const { reviews, docs, classes } = state.coach;

  return {
    reviews,
    docs,
    classes,
  }
}

export default connect(mapStateToProps, {fetchReviews, fetchDocs, fetchRelevantClasses})(CoachProfile);
