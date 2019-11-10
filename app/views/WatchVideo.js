import React from 'react';
import { Alert, Clipboard, View, Text, SafeAreaView } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon } from 'react-native-elements';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import APIManager from '../networking/APIManager';
import CaptionPlayer from '../components/CaptionPlayer';
import HomeHeader from '../components/HomeHeader';

import ModelManager from '../models/controller';

const youtubeRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<>\n $#]+)/
const watchStatesEnum = { preCopy: 0, selectLanguage: 1, showPlayer: 3}

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
      selectedLanguage: '',
      state: watchStatesEnum.preCopy,
      error: "",
      clipboardHasYoutube: false,
      isFetching: false
    }

  }

  componentDidMount() {
    let apiManager = APIManager.getInstance();
    // this.readFromClipboard()
    // if(youtubeRegex.test(this.state.clipboardContent)){
    //   this.setState({ clipboardHasYoutube: true })
    // }
    
    //if loading from homepage
    if(this.props.navigation.state.params.language && this.props.navigation.state.params.videoId){
      this.setState({
        selectedLanguage: this.props.navigation.state.params.language,
        youtubeId: this.props.navigation.state.params.videoId
      })
      this.getCaption(this.props.navigation.state.params.language, this.props.navigation.state.params.videoId)
    }else if(this.props.navigation.state.params.videoId){
      this.setState({
        youtubeId: this.props.navigation.state.params.videoId,
      })
      this.getCaptionLanguages(this.props.navigation.state.params.videoId)
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

  getSupportedCaption(index){
    this.setState({
      isFetching:true,
      selectedLanguage: this.state.supportedLanguages[index]
    })
    this.getCaption(this.state.supportedLanguages[index])
  }

  getOtherCaption(index){
    this.setState({
      isFetching:true,
      selectedLanguage: this.state.otherLanguages[index]
    })
    this.getCaption(this.state.otherLanguages[index])
  }

  getCaption(lang,vidId = this.state.youtubeId){
    let apiManager = APIManager.getInstance();
    apiManager.getVideoCaptions(vidId,lang)
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        var videoData = ModelManager.loadVideo(response.data.video)
        this.setState({
          state: watchStatesEnum.showPlayer,
          captionData: response.data.captions,
          videoData: videoData
        })
      }else{
        this.setState({error:true})
      }
    })
  }

  getCaptionLanguages(vidId = this.state.youtubeId){
    this.setState({isFetching:true})
    let apiManager = APIManager.getInstance();
    apiManager.getVideoCaptionLanguages(vidId)
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        this.setState({
          state: watchStatesEnum.selectLanguage,
          supportedLanguages: response.data.supported,
          otherLanguages: response.data.other,
          audioLanguage: response.data.audio
        })
      }else{
        this.setState({error:true})
      }
    })
  }

  goBack(){
    if(this.state.selectedLanguage.length > 0 && this.props.navigation.state.params.onGoBack){
      this.props.navigation.state.params.onGoBack(this.state.selectedLanguage)
      this.props.navigation.goBack()
    }else{
      this.props.navigation.goBack()
    }

  }

  render() {
    var hasSupportedCaptions = this.state.supportedLanguages.length > 0
    var hasOtherCaptions = this.state.otherLanguages.length > 0
    var languagePageTitle = this.state.supportedLanguages.length > 0 ? 'What language do you want to learn' : "No Languages :("
    return (
      <View style={styles.safeArea}>
        <HomeHeader
          titleList={[]}
          currentTitleIndex={0}
          onLeftClick={() => this.goBack()}
        />
        { this.state.state === watchStatesEnum.showPlayer &&
          <View style={styles.container}>
            <CaptionPlayer
              videoData={this.state.videoData}
              captionData={this.state.captionData} // control playback of video with true/false
              language={this.state.selectedLanguage}
            />
          </View>
        }
        { this.state.state === watchStatesEnum.selectLanguage &&
          <View style={styles.container}>
          <Text>{languagePageTitle}</Text>
          {hasSupportedCaptions &&
            this.state.supportedLanguages.map((language, i) => (
              <Button
                key={i}
                loading={this.state.isFetching}
                buttonStyle={[styles.button, styles.btnFullWidth]}
                title={language}
                backgroundColor={colors.btnBlue}
                onPress={(data) => this.getSupportedCaption(i)}
              />
            ))
          }
          {hasOtherCaptions &&
            <Text>Other Languages</Text>
          }
          {hasOtherCaptions &&
              this.state.otherLanguages.map((language, i) => (
                <Button
                  key={i}
                  loading={this.state.isFetching}
                  buttonStyle={[styles.button, styles.btnFullWidth]}
                  title={language}
                  backgroundColor={colors.btnBlue}
                  onPress={(data) => this.getOtherCaption(i)}
                />
              ))
          }
          </View>

        }
        { this.state.state === watchStatesEnum.preCopy &&
          <View style={styles.container}>
            <Text>{this.state.clipboardHasYoutube ? "youtube" : "noyoutube"}</Text>
            <Text>{this.state.videoData.videoId}</Text>
            <Text>{this.state.clipboardContent}</Text>
          </View>
        }
      </View>
    );
  }
}
