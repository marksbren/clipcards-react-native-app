import React from 'react';
import { Alert, Clipboard, View, Text, Dimensions } from 'react-native';
import YouTube from 'react-native-youtube';
import { Button, Icon, ButtonGroup } from 'react-native-elements';
import {colors} from '../styles/styles';
import {styles} from '../styles/styles'
import LanguageHelpers from '../helpers/languageHelpers'
import APIManager from '../networking/APIManager';
import * as Progress from 'react-native-progress'

const width = Dimensions.get('window').width

import ModelManager from '../models/controller';

let apiManager = APIManager.getInstance();

const skipSeconds = 5


export default class CaptionPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captionData: this.props.captionData,
      videoData: this.props.videoData,
      language: this.props.language,
      captionIndex: 0,
      activeBookmarkCount: 0,
      captionScripts: [],
      captionScriptIndex: 0,
      isReady: false,
      playbackCompleted: false,
      status: "",
      quality: "",
      error: "",
      playVideo:false,
      clipboardHasYoutube: false,
      isFetching: false,
      videoFinished: false,
      videoDuration: 100,
      videoCurrentTime: 0
    }

    this._youTubeRef = React.createRef()
  }

  componentDidMount() {
    var setupCaptionScripts = []
    if(LanguageHelpers.hasMultipleScripts(this.state.language)){
      setupCaptionScripts = LanguageHelpers.getScripts(this.state.language)
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
      this.loadVideoToTime(newTime)
      this.updateIndexAndPlay(newTime)
    })
    .catch((errorMessage) => { this.setState({error: errorMessage}) });
  }

  jumpForward(){
    this._currentPlayTime()
    .then((currentTime) => {
      var newTime = currentTime + skipSeconds
      this.loadVideoToTime(newTime)
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

  updateIndexAndPlay(newTime){
    this.updateIndex(newTime)
    this.setState({
      playVideo: true
    })
  }

  updateIndex(newTime){
    if(newTime * 1000 < this.state.captionData[0].end){
      this.setState({
        captionIndex: 0
      })
    }else if(newTime * 1000 > this.state.captionData[this.state.captionData.length-1].end){
      this.setState({
        captionIndex: this.state.captionData.length-1
      })
    }else{
      for (var i = 0; i < this.state.captionData.length; i++) {
        if(newTime * 1000 < this.state.captionData[i].end){
          this.setState({
            captionIndex: i
          })
          break
        }
      }
    }
  }

  loadVideoToTime(time){
    this._youTubeRef.current.seekTo(time)
  }

  checkProgress(){
    if(!this.state.playVideo){ return }
    this._currentPlayTime()
    .then((currentTime) => {
      this._duration()
      .then((duration) => {
        ModelManager.updateVideoPlayStats(this.state.videoData._id, duration, currentTime, this.state.playbackCompleted)
        var moveNext = currentTime * 1000 > this.state.captionData[this.state.captionIndex].end
        if(duration - currentTime < 20){
          console.warn("video Ending")
          this.setState({videoFinished: true})
        }
        if(this.state.captionIndex < this.state.captionData.length - 1 && moveNext){
          this.updateIndexAndPlay(currentTime)
        }
        this.setState({
          videoDuration: duration,
          videoCurrentTime: currentTime
        })
      })
    })
    .catch((errorMessage) => { console.warn(errorMessage) });
  }

  _duration(){
    return new Promise((resolve, reject) => {
      this._youTubeRef.current
        .getDuration()
        .then((duration) => { resolve(duration) })
        .catch((errorMessage) => { reject(errorMessage) });
      })
  }

  _currentPlayTime(){
    return new Promise((resolve, reject) => {
      this._youTubeRef.current
        .getCurrentTime()
        .then((currentTime) => { resolve(currentTime) })
        .catch((errorMessage) => { reject(errorMessage) });
      })
  }

  loadStartPosition(){
    var startTime = 0
    if(this.state.videoData.previousPlayTime > 10){
      startTime = this.state.videoData.previousPlayTime - 10
    }else if(this.state.videoData.previousPlayTime > 0){
      startTime = this.state.videoData.previousPlayTime
    }

    if(this.props.videoStartTime > 0){
      startTime = this.props.videoStartTime
    }

    console.warn(startTime)

    this.loadVideoToTime(startTime)
    this.updateIndex(startTime)
  }

  saveWordToggle(i){
    var wordKey = this._generateWordKey(i)
    var newBookmark = this._generateBookmarkObject(wordKey)
    var captionData = this.state.captionData[this.state.captionIndex]
    captionData.videoId = this.state.videoData._id
    ModelManager.updateBookmark(newBookmark,captionData)
    // apiManager.updateBookmark(newBookmark,isActive,this.state.captionScriptIndex)
    this.setState({
      activeBookmarkCount: ModelManager.videoBookmarkCount(this.state.videoData._id)
    })
  }

  _wordIsSaved(wordKey){
    var wordIsSaved = false
    if(ModelManager.bookmarkIsSaved(this._generateBookmarkObject(wordKey))){
      wordIsSaved = true
    }
    return wordIsSaved
  }

  _generateWordKey(i){
    return this.state.captionData[this.state.captionIndex]["_id"] + "|" + i
  }

  _generateBookmarkObject(wordKey){
    var keys = wordKey.split("|")
    var result = {
      captionDataId: keys[0],
      captionDataIndex: Number(keys[1]),
      tappedIndex: this.state.captionScriptIndex
    }
    return result
  }

  onPlayerReady(e){
    this.loadStartPosition()
    this.setState({ isReady: true })
  }

  onChangeState(e){
    if(!this.state.playVideo && e.state === "playing"){
      this.playPause()
    }else if( this.state.playVideo && e.state === "paused" ){
      this.playPause()
    }else if( e.state === "ended"){
      this.setState({
        videoFinished: true,
        playVideo: false
      })
    }
  }

  playPause(){
    var tmpPlay = this.state.playVideo
    this.setState({
      playVideo: !tmpPlay
    })
  }

  changeScript(i){
    this.setState({
      captionScriptIndex: i
    })
  }

  render() {
    var hasMultipleScripts = this.state.captionScripts.length > 0
    var scriptButtons = LanguageHelpers.getScripts(this.state.language)
    var viewPercent = this.state.videoCurrentTime / this.state.videoDuration
    return (
      <View style={styles.container}>
        <YouTube
          ref={this._youTubeRef}
          videoId={this.state.videoData.videoId}// The YouTube video ID
          play={this.state.playVideo} // control playback of video with true/false
          controls={0}
          showFullscreenButton={false}
          modestbranding={true}
          showinfo={false}
          origin="http://www.youtube.com"
          rel={false}
          onReady={e => this.onPlayerReady(e)}
          onChangeState={e => this.onChangeState(e)}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onError={e => this.setState({ error: e.error })}
          style={styles.youtubeContainer}
        />
        <View>
          <Progress.Bar borderWidth={0} unfilledColor='rgba(32,137,220,0.1)' color='rgba(32,137,220,1)' borderRadius={0} height={3} progress={viewPercent} width={width} />
        </View>
        <View style={styles.videoControlContainer}>
          <Button
            key={0}
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name='angle-left' type='font-awesome'/>
            }
            onPress={() => this.jumpBack()}
          />
          <Button
            key={1}
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name={this.state.playVideo ? 'pause' : 'play' } type='font-awesome'/>
            }
            onPress={() => this.playPause()}
          />
          <Button
            key={2}
            buttonStyle={[styles.controlButton]}
            type="outline"
            icon={
              <Icon color={colors.btnBlue} name='angle-right' type='font-awesome'/>
            }
            onPress={() => this.jumpForward()}
          />
        </View>
        {hasMultipleScripts &&
            <ButtonGroup
              onPress={(i) => this.changeScript(i)}
              selectedIndex={this.state.captionScriptIndex}
              buttons={scriptButtons}
              containerStyle={styles.scriptSelectorUnselected}
              selectedButtonStyle={styles.scriptSelectorSelected}
              selectedTextStyle={styles.scriptSelectorSelectedText}
            />

        }
        <View style={styles.wordButtonContainer}>
        {
          this.state.captionData[this.state.captionIndex].words.map((word, i) => (
            <View key={i}>
            {word.type === "word" ? (
              <Button
                key={i}
                title={word.text[this.state.captionScriptIndex] ? word.text[this.state.captionScriptIndex] : word.text[0]}
                buttonStyle={this._wordIsSaved(this._generateWordKey(i)) ? styles.bookmarkedButton : styles.unbookmarkedButton }
                type="outline"
                containerStyle={[styles.wordButton]}
                onPress={(data) => this.saveWordToggle(i)}
              />
            ) : (
              <Text key={i} style={styles.captionText}>{word.text[0]}</Text>
            )}
            </View>
          ))
        }
        </View>
        {this.state.activeBookmarkCount > 0 &&
          <Text>{this.state.activeBookmarkCount}</Text>
        }

      </View>
    );
  }
}
