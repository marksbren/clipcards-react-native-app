import React from 'react';
import { Alert, Clipboard, View, Text, SafeAreaView } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon } from 'react-native-elements';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';
import APIManager from '../networking/APIManager';
import CaptionPlayer from '../components/CaptionPlayer';

const youtubeRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<>\n $#]+)/
const watchStatesEnum = { preCopy: 0, selectLanguage: 1, showPlayer: 3}

export default class WatchVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeId: "",
      captionData: [],
      languagesAvailable: [],
      selectedLanguage: 'en',
      state: watchStatesEnum.preCopy,
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

  getCaption(index){
    this.setState({
      isFetching:true,
      selectedLanguage: this.state.languagesAvailable[index]
    })
    let apiManager = APIManager.getInstance();
    apiManager.getVideoCaptions(this.state.youtubeId,this.state.languagesAvailable[index])
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        this.setState({
          state: watchStatesEnum.showPlayer,
          captionData: response.data
        })
      }else{
        this.setState({error:true})
      }
    })
  }

  getCaptionLanguages(){
    this.setState({isFetching:true})
    let apiManager = APIManager.getInstance();
    apiManager.getVideoCaptionLanguages(this.state.youtubeId)
    .then((response) => {
      this.setState({isFetching:false})
      if(response.success){
        this.setState({
          state: watchStatesEnum.selectLanguage,
          languagesAvailable: response.data.languages
        })
      }else{
        this.setState({error:true})
      }
    })
  }

  render() {
    var hasCaptions = this.state.languagesAvailable.length > 0
    var languagePageTitle = this.state.languagesAvailable.length > 0 ? 'What language do you want to learn' : "No Languages :("
    return (
      <SafeAreaView style={styles.safeArea}>
        { this.state.state === watchStatesEnum.showPlayer &&
          <View style={styles.container}>
            <CaptionPlayer
              youtubeId={this.state.youtubeId}// The YouTube video ID
              captionData={this.state.captionData} // control playback of video with true/false
              language={this.state.selectedLanguage}
            />
          </View>
        }
        { this.state.state === watchStatesEnum.selectLanguage &&
          <View style={styles.container}>
          <Text>{languagePageTitle}</Text>
          {hasCaptions &&
            this.state.languagesAvailable.map((language, i) => (
              <Button
                key={i}
                loading={this.state.isFetching}
                buttonStyle={[styles.button, styles.btnFullWidth]}
                title={language}
                backgroundColor={colors.btnBlue}
                onPress={(data) => this.getCaption(i)}
              />
            ))
          }
          </View>

        }
        { this.state.state === watchStatesEnum.preCopy &&
          <View style={styles.container}>
            <Text>{this.state.clipboardHasYoutube ? "youtube" : "noyoutube"}</Text>
            <Text>{this.state.youtubeId}</Text>
            <Text>{this.state.clipboardContent}</Text>
          </View>
        }
      </SafeAreaView>
    );
  }
}
