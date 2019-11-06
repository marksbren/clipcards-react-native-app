import React from 'react';
import { Alert, Clipboard, View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';


export default class VideoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      thumbnailUrl: this.props.thumbnailUrl
    }
  }

  componentDidMount() {
  }

  onTapPress(){
    this.props.onTap(this.props.listItem)
    // console.warn("tap")
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onTapPress()}
        >
          <Image
            style={styles.videoCard}
            source={{uri: this.state.thumbnailUrl}}
          />
          <Text>{this.state.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
