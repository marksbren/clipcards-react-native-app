import React from 'react';
import { Alert, Clipboard, View, Text, SafeAreaView } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon } from 'react-native-elements';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import APIManager from '../networking/APIManager';
import CaptionPlayer from '../components/CaptionPlayer';

import ModelManager from '../models/controller';

const youtubeRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<>\n $#]+)/

export default class WatchVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeId: "",
      videoData: {},
      captionData: [],
      audioLanguage: "",
      supportedLanguages: [],
      otherLanguages: [],
      currentLanguage: 'en',
      error: "",
      clipboardHasYoutube: false,
      isFetching: false
    }

  }

  componentDidMount() {
    let apiManager = APIManager.getInstance();
    this.readFromClipboard()
    if(youtubeRegex.test(this.state.clipboardContent)){
      this.setState({ clipboardHasYoutube: true })
    }
  }

  readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    var clipboardHasYoutube=false
    var youtubeId = ""
    if(youtubeRegex.test(clipboardContent)){
      var match = youtubeRegex.exec(clipboardContent)
      clipboardHasYoutube = true
      youtubeId = match[1]
      this.showYoutubeAlert()
    }
    this.setState({
      clipboardContent: clipboardContent,
      clipboardHasYoutube: clipboardHasYoutube,
      youtubeId: youtubeId
    });
  };

  showYoutubeAlert(){
    Alert.alert(
      'Youtube Video Found',
      'A Youtube Video was found in your clipboard. Import it?',
      [
        {
          text: 'No, thanks',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.getCaptionLanguages()},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        {
          this.state.todaysVideos.map((video, i) => (
          ))
        }
        </View>
      </SafeAreaView>
    );
  }
}
