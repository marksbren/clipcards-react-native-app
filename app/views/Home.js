import React from 'react';
import { Alert, Clipboard, View, Text, SafeAreaView } from 'react-native';
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
      isFetching: false
    }

  }

  componentDidMount() {
    var clipboardHasYoutube = false
    let apiManager = APIManager.getInstance();
    var languageList = ModelManager.languageList()
    var videoList = languageList[this.state.currentLanguageIndex].videos

    // if(this.props.navigation.state.params && this.props.navigation.state.params.language){
    //   this.setupLanguage(this.props.navigation.state.params.language)
    // }

    this.readFromClipboard()
    if(youtubeRegex.test(this.state.clipboardContent)){
      clipboardHasYoutube = true
    }
    this.setState({
      clipboardHasYoutube: clipboardHasYoutube,
      languageList: languageList,
      videoList: videoList
    })
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
    var clipboardContent = await Clipboard.getString();
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
    this.props.navigation.navigate("video",{
      videoId: this.state.youtubeId,
      onGoBack: (lang) => this.setupLanguage(lang)
    })
  }

  openVideo(i){
    var videoId = this.state.videoList[i].videoId
    var lang = this.state.languageList[this.state.currentLanguageIndex].code
    this.props.navigation.navigate("video",{language: lang, videoId: videoId})
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
          <View>
          {this.state.videoList.map((video, i) => (
              <VideoCard
                key={video.videoId + i}
                listItem={i}
                title={video.videoTitle}
                videoId={video.videoId}
                thumbnailUrl={video.videoThumbnail}
                onTap={(i) => this.openVideo(i)}
              />
            ))
          }
          </View>
        </View>
      </ActionSheetProvider>
    );
  }
}
