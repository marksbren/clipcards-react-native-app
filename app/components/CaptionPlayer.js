import React from 'react';
import { Alert, Clipboard, View, Text } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon } from 'react-native-elements';
import {colors} from '../styles/styles';
import {styles} from '../styles/styles'
import {hasMultipleScripts, getScripts} from '../helpers/languageHelpers'

const skipSeconds = 5


export default class CaptionPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeId: this.props.youtubeId,
      captionData: this.props.captionData,
      language: this.props.language,
      bookmarkedWords: [],
      bookmarkLookup: {},
      captionIndex: 0,
      captionScripts: [],
      captionScriptIndex: 0,
      isReady: false,
      status: "",
      quality: "",
      error: "",
      playVideo:false,
      clipboardHasYoutube: false,
      isFetching: false,
    }

    this._youTubeRef = React.createRef()
  }

  componentDidMount() {
    var setupCaptionScripts = []
    if(hasMultipleScripts(this.state.language)){
      setupCaptionScripts = getScripts(this.state.language)
    }
    this.setState({
      checkVideoTimer: setInterval(() => {this.checkProgress()}, 500),
      captionScripts: setupCaptionScripts
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.checkVideoTimer);
    this._pauseVideo()
  }

  jumpBack(){
    this._currentPlayTime()
    .then((currentTime) => {
      var newTime = currentTime - skipSeconds
      this._youTubeRef.current.seekTo(newTime)
      this.updateIndex(newTime)
    })
    .catch((errorMessage) => { this.setState({error: errorMessage}) });
  }

  jumpForward(){
    this._currentPlayTime()
    .then((currentTime) => {
      var newTime = currentTime + skipSeconds
      this._youTubeRef.current.seekTo(newTime)
      this._playVideo()
      this.checkProgress()
    })
    .catch((errorMessage) => { this.setState({error: errorMessage}) });
  }

  _playVideo(){
    this.setState({
      playVideo: true
    })
  }

  _pauseVideo(){
    this.setState({
      playVideo: false
    })
  }

  updateIndex(newTime){
    if(newTime * 1000 < this.state.captionData[0].end){
      this.setState({
        captionIndex: 0,
        playVideo: true
      })
    }else if(newTime * 1000 > this.state.captionData[this.state.captionData.length-1].end){
      this.setState({
        captionIndex: this.state.captionData.length-1,
        playVideo: true
      })
    }else{
      for (var i = 0; i < this.state.captionData.length; i++) {
        if(newTime * 1000 < this.state.captionData[i].end){
          this.setState({
            captionIndex: i,
            playVideo: true
          })
          break
        }
      }
    }
  }

  checkProgress(){
    if(!this.state.playVideo){ return }
    this._currentPlayTime()
    .then((currentTime) => {
      var moveNext = currentTime * 1000 > this.state.captionData[this.state.captionIndex].end
      if(this.state.captionIndex < this.state.captionData.length - 1 && moveNext){
        this.updateIndex(currentTime)
      }
    })
    .catch((errorMessage) => { console.warn(errorMessage) });
  }

  _currentPlayTime(){
    return new Promise((resolve, reject) => {
      this._youTubeRef.current
        .getCurrentTime()
        .then((currentTime) => { resolve(currentTime) })
        .catch((errorMessage) => { reject(errorMessage) });
      })
  }

  saveWordToggle(i){
    var wordKey = this._generateWordKey(i)
    var newBookmarkedWords = this.state.bookmarkedWords
    var newBookmarkLookup = this.state.bookmarkLookup
    if(this._wordIsSaved(wordKey)){
      for (let [key, item] of newBookmarkedWords.entries()) {
        if(item.captionDataId === this.state.captionData[this.state.captionIndex]._id && item.wordIndex === i){
          newBookmarkedWords.splice(key,1)
          break
        }
      }
      delete newBookmarkLookup[wordKey]
    }else{
      var newBookmark = {
        captionDataId: this.state.captionData[this.state.captionIndex]._id,
        wordIndex: i
      }
      newBookmarkedWords.push(newBookmark)
      newBookmarkLookup[this._generateWordKey(i)] = true
    }
    this.setState({
      bookmarkedWords: newBookmarkedWords,
      bookmarkLookup: newBookmarkLookup
    })
  }

  _wordIsSaved(wordKey){
    var wordIsSaved = false
    if(this.state.bookmarkLookup.hasOwnProperty(wordKey)){
      wordIsSaved = true
    }
    return wordIsSaved
  }

  _generateWordKey(i){
    return this.state.captionData[this.state.captionIndex]._id + "|" + i
  }

  playPause(){
    var tmpPlay = this.state.playVideo
    this.setState({
      playVideo: !tmpPlay
    })
  }

  switchScript(){
    var nextIndex = this.state.captionScriptIndex + 1
    if(this.state.captionScripts.length === this.state.captionScriptIndex + 1){
      nextIndex = 0
    }
    this.setState({
      captionScriptIndex: nextIndex
    })
  }

  render() {
    var hasMultipleScripts = this.state.captionScripts.length > 0
    var hasBookmarkedWords = this.state.bookmarkedWords.length > 0
    return (
      <View style={styles.container}>
        <YouTube
          ref={this._youTubeRef}
          videoId={this.state.youtubeId}// The YouTube video ID
          play={this.state.playVideo} // control playback of video with true/false
          controls={0}
          showFullscreenButton={false}
          modestbranding={true}
          showinfo={false}
          rel={false}
          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => this.setState({ status: e.state })}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onError={e => this.setState({ error: e.error })}
          style={styles.youtubeContainer}
        />
        <View style={styles.videoControlContainer}>
          <Button
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name='angle-left' type='font-awesome'/>
            }
            onPress={() => this.jumpBack()}
          />
          <Button
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name={this.state.playVideo ? 'pause' : 'play' } type='font-awesome'/>
            }
            onPress={() => this.playPause()}
          />
          <Button
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name='angle-right' type='font-awesome'/>
            }
            onPress={() => this.jumpForward()}
          />
        </View>
        <View style={styles.wordButtonContainer}>
        {
          this.state.captionData[this.state.captionIndex].words.map((word, i) => (
            <View>
            {word.type === "space" &&
              <Text key={i}>{word.text[0]}</Text>
            }
            {word.type === "punctuation" &&
              <Text key={i}>{word.text[0]}</Text>
            }
            {word.type === "default" &&
              <Text key={i}>{word.text[0]}</Text>
            }
            {word.type === "word" &&
              <Button
                key={i}
                title={word.text[this.state.captionScriptIndex]}
                buttonStyle={this._wordIsSaved(this._generateWordKey(i)) ? styles.bookmarkedButton : styles.unbookmarkedButton }
                raised
                type="outline"
                containerStyle={[styles.wordButton]}
                onPress={(data) => this.saveWordToggle(i)}
              />
            }
            </View>
          ))
        }
        </View>
        {hasMultipleScripts &&
          <View style={styles.scriptButtonContainer}>
            <Button
              title={this.state.captionScripts[this.state.captionScriptIndex]}
              raised
              type="outline"
              containerStyle={[styles.wordButton]}
              onPress={(data) => this.switchScript()}
            />
          </View>

        }
        {hasBookmarkedWords &&
          <Text>{this.state.bookmarkedWords.length}</Text>
        }

      </View>
    );
  }
}
