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

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageList: [],
      currentLanguageIndex: 0,
      videoList: [],
      error: "",
      clipboardHasYoutube: false,
      isFetching: false,
      alertShown: false,
    }

  }

  componentDidMount() {
    let apiManager = APIManager.getInstance();
    var languageList = ModelManager.languageList()
    var videoList = languageList.length > 0 ? languageList[this.state.currentLanguageIndex].videos : []

    this.setState({
      clipboardCheck: setInterval(() => {this.readFromClipboard()}, 500),
      languageList: languageList,
      videoList: videoList
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.clipboardCheck);
  }

  setupLanguage(language){
    var languageList = ModelManager.languageList()
    var languageIndex = 0
    for(var i = 0; i < languageList.length; i++){
      if(languageList[i].code == language){
        languageIndex = i
      }
    }

    var videoList = languageList[languageIndex].videos
    this.setState({
      languageList: languageList,
      videoList: videoList,
      currentLanguageIndex: languageIndex
    })
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

  changeLanguage(i){
    var videoList = this.state.languageList[i].videos
    this.setState({
      videoList: videoList,
      currentLanguageIndex: i
    })
  }

  openNewVideo(){
    this.setState({
      previousYoutubeId: this.state.youtubeId,
      alertShown: false
    })
    this.props.navigation.navigate("video",{
      videoId: this.state.youtubeId,
      onGoBack: (lang) => this.setupLanguage(lang)
    })
  }

  openVideo(i){
    var video = this.state.videoList[i]
    this.props.navigation.navigate("video",{
      language: video.captionLanguage,
      videoId: video.videoId})
  }

  render() {
    if(this.state.languageList.length == 0){
      return (
        <View style={styles.container}>
          <Text>No Languages</Text>
        </View>
      )
    }
    var langList = []
    for(var i = 0; i < this.state.languageList.length; i++){
      langList.push(this.state.languageList[i].code)
    }
    var currentLanguage = this.state.languageList[this.state.currentLanguageIndex]
    return (
      <ActionSheetProvider>
        <View style={styles.container}>
          <HomeHeader
            titleList={langList}
            currentTitleIndex={this.state.currentLanguageIndex}
            onTitleChange={(i) => this.changeLanguage(i)}
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
