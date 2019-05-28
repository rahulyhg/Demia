import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
 ScaledSheet, moderateScale
} from 'react-native-size-matters';
import { ImgThumbnail } from './ImgThumbnail'
import  FastImage  from 'react-native-fast-image';
var _ = require('lodash')

class DocumentImgViewer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      docs: props.docs,
      showViewer: false,
      imgIndex: 0,
      imgUrls: [],
      urls: [],
    }
  }

  toggleImageViewer() {
    this.setState({ showViewer: !this.state.showViewer,});
  }

  renderImageViewer() {
    var urls = []
    _.forEach(this.props.docs, (doc) => {
      const info = {
        url: doc.docURL,
        docType: doc.docType
      }
      urls.push(info)
    })
    if (this.state.showViewer) {
      return (
        <Modal animationType="slide" visible={true} transparent={true}>
          <ImageViewer
            saveToLocalByLongPress={false}
            onCancel={() => this.toggleImageViewer()}
            enableSwipeDown={true}
            imageUrls={this.state.urls}
            index={this.state.index}
          />
          <View style={styles.x}>
            <TouchableOpacity onPress={() => this.toggleImageViewer()}>
              <FastImage
                source={require("../../../assets/icons/x.png")}
                style={{ height: moderateScale(40), width: moderateScale(40) }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      )
    }
  }

  renderPhotoThumbnails() {
      let urls = []
      let count = 0
      _.forEach(this.props.docs, (doc) => {
        const info = {
          url: doc.docURL,
          docType: doc.docType,
          index: count,
        }
        urls.push(info)
        count = count + 1
      })
    return (
      <View>
        <FlatList
          data={urls}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ImgThumbnail
              imgUrl={item.url}
              pressed={() => {
                this.setState({ urls, index: item.index })
                setTimeout(() => this.toggleImageViewer(), 30)
              }}
            />
          )}
          keyExtractor={item => item.docType}
        />
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.renderPhotoThumbnails()}
        {this.renderImageViewer()}
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  navImg: {
    width: "40@ms",
    height: "40@ms"
  },
  x: {
    height: "60@ms",
    flexDirection: "row",
    paddingTop: "20@ms",
    paddingLeft: "15@ms",
    paddingBottom: "10@ms",
    position: "absolute"
  },
  smallText: {
    color: "#fff",
    fontSize: "18@ms",
    fontFamily: "Verdana",
    marginLeft: "10@ms"
  },
})

export {DocumentImgViewer};
