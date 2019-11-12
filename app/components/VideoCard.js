import React from 'react';
import { Alert, Clipboard, View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import TimeHelper from '../helpers/timeHelpers';


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
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onTapPress()}
        >
          <Image
            style={styles.videoCard}
            source={{uri: this.state.video.videoThumbnail}}
          />
          <Text>{this.state.video.videoTitle}</Text>
          <Text>{lastViewedString}</Text>

        </TouchableOpacity>
      </View>
    )
  }
}
