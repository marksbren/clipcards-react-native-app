import React from 'react';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon, ListItem, Header } from 'react-native-elements';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import APIManager from '../networking/APIManager';
import CaptionPlayer from '../components/CaptionPlayer';
import HomeHeader from '../components/HomeHeader';
import VideoCard from '../components/VideoCard';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import ModelManager from '../models/controller';

const youtubeRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<>\n $#]+)/

export default class VideoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.navigation.state.params.language,
      videoList: [],
      error: "",
      clipboardHasYoutube: false,
      isFetching: false,
      alertShown: false,
    }

  }

  componentDidMount() {
    var videoList = this.state.language.videos

    this.setState({
      clipboardCheck: setInterval(() => {this.readFromClipboard()}, 500),
      videoList: videoList
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.clipboardCheck);
  }


  readFromClipboard = async () => {
    if(this.state.alertShown){
      return
    }
    var clipboardContent = await Clipboard.getString();
    var clipboardHasYoutube=false
    var youtubeId = ""
    if(youtubeRegex.test(clipboardContent)){
      var match = youtubeRegex.exec(clipboardContent)
      clipboardHasYoutube = true
      youtubeId = match[1]
      if(youtubeId != this.state.previousYoutubeId){
        this.showYoutubeAlert()
      }
    }
    this.setState({
      clipboardContent: clipboardContent,
      clipboardHasYoutube: clipboardHasYoutube,
      youtubeId: youtubeId
    });
  };

  cancelAlert(){
    this.setState({
      previousYoutubeId: this.state.youtubeId,
      alertShown: false
    })
  }

  showYoutubeAlert(){
    this.setState({
      alertShown: true
    })
    Alert.alert(
      'Youtube Video Found',
      'A Youtube Video was found in your clipboard. Import it?',
      [
        {
          text: 'No, thanks',
          onPress: () => this.cancelAlert(),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.openNewVideo()},
      ],
      {cancelable: false},
    );
  }

  openNewVideo(){
    this.setState({
      previousYoutubeId: this.state.youtubeId,
      alertShown: false
    })
    this.props.navigation.navigate("video",{
      videoId: this.state.youtubeId
    })
  }

  openVideo(i){
    var video = this.state.videoList[i]
    this.props.navigation.navigate("video",{
      language: video.captionLanguage,
      videoId: video.videoId})
  }

  render() {
    return (
      <ActionSheetProvider>
        <View style={styles.container}>
          <HomeHeader
            titleList={["Videos"]}
            currentTitleIndex={0}
          />
          <ScrollView>
              {this.state.videoList.map((video, i) => (
                  <VideoCard
                    key={video.videoId + i}
                    listItem={i}
                    video={video}
                    title={video.videoTitle}
                    videoId={video.videoId}
                    thumbnailUrl={video.videoThumbnail}
                    onTap={(i) => this.openVideo(i)}
                  />
                ))
              }
          </ScrollView>
        </View>
      </ActionSheetProvider>
    );
  }
}
