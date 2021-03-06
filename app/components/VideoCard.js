import React from 'react';
import { Alert, Clipboard, View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import TimeHelper from '../helpers/timeHelpers';
import ProgressBar from '../components/ProgressBar'


export default class VideoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: this.props.video,
    }
  }

  componentDidMount() {
  }

  onTapPress(){
    this.props.onTap(this.props.listItem)
    // console.warn("tap")
  }

  render() {
    var lastViewedString = "Last viewed: " + TimeHelper.timeAgoString(this.state.video.lastViewedAt)
    var bookmarkCountString = this.state.video.bookmarkCount()
    var viewPercent = this.state.video.viewPercentage()
    return (
      <View>
        <TouchableOpacity onPress={() => this.onTapPress()}>
          <Image
            style={styles.videoCard}
            source={{uri: this.state.video.videoThumbnail}}
          />
          <ProgressBar percentage={viewPercent}/>
          <Text>{this.state.video.videoTitle}</Text>
          <Text>{lastViewedString} | {this.state.video.bookmarkCount()} bookmarks </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
