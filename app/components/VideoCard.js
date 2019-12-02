import React from 'react';
import { Alert, Clipboard, View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import TimeHelper from '../helpers/timeHelpers';
import * as Progress from 'react-native-progress'


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
        <TouchableOpacity
          onPress={() => this.onTapPress()}
        >
          <Image
            style={styles.videoCard}
            source={{uri: this.state.video.videoThumbnail}}
          />
          <Progress.Bar borderWidth={0} unfilledColor='rgba(32,137,220,0.1)' color='rgba(32,137,220,1)' borderRadius={0} height={3} progress={viewPercent} width={null} />
          <Text>{this.state.video.videoTitle}</Text>
          <Text>{lastViewedString} | {this.state.video.bookmarkCount()} bookmarks </Text>

        </TouchableOpacity>
      </View>
    )
  }
}
