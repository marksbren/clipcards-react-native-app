import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import LanguageHelpers from '../helpers/languageHelpers';
import SuperMemo from '../helpers/SuperMemo';
import {styles,colors} from '../styles/styles';
import { Button } from 'react-native-elements'
import ModelManager from '../models/controller';


export default class StudyCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      caption: this.props.caption,
      directionToNative: this.props.toNative,
      cardData: [],
      language: this.props.language,
      frontData: this.props.frontData,
      button0Title: "",
      button1Title: "",
      showBack: false
    }
  }

  componentDidMount() {
    var cardData = []
    this.state.frontData.map((scriptIndex, i) => {
      var needsScript = LanguageHelpers.languageScriptNeedsSpaces(this.state.language,scriptIndex)
      cardData.push(this.state.caption.bookmarkData(scriptIndex,needsScript))
    })
    this.setButtons()
    this.setState({
      cardData: cardData
    })
  }

  createCardBackToNative(toNative){
    return this.createCardFrontToNative(!toNative)
  }

  createCardFrontToNative(toNative){
    var response = []
    if(toNative){
      this.state.cardData.map((dataItem, j) => {
        response.push(
          <View style={styles.studyCardSentanceContainer}>
            {this.toNativeStudyString(dataItem)}
          </View>
        )
      })
    }else{
      response.push(
        <View style={styles.studyCardSentanceContainer}>
          <Text key='translation' style={[styles.bkmkListText]}>{this.state.caption.translation}</Text>
        </View>
      )
    }
    return response
  }

  toNativeStudyString(studyData){
    var response = []
    studyData.map((word, i) => {
      if(word.isBookmarked){
        response.push(<Text key={i} style={[styles.bkmkListText,styles.bkmkActive]}>{word.text}</Text>)
      }else{
        response.push(<Text key={i} style={styles.bkmkListText}>{word.text}</Text>)
      }
    })
    return response
  }

  setButtons(){
    var buttonList = SuperMemo.getScorePreview(this.state.caption.getScoreCardObject(this.state.directionToNative))
    this.setState({
      button0Title: buttonList[0],
      button1Title: buttonList[1]
    })
  }

  createVideoTitle() {
    var string = []
    string.push(<Text key="title">{this.state.caption.video.shortTitle() + " @ " + this.state.caption.startTimeString()}</Text>)
    return string
  }

  gradeQuestion(i){
    // console.warn(this.state.caption.getScoreCardObject(this.state.directionToNative))
    var cardObject = this.state.caption.getScoreCardObject(this.state.directionToNative)
    var newCard = SuperMemo.scoreCard(cardObject,i)
    ModelManager.scoreCaption(this.state.caption,newCard,this.state.directionToNative)
    this.props.onNext(newCard.interval == 0)
  }

  showBack(){
    this.setState({
      showBack: true
    })
  }

  onVideoStringPress(){
    this.props.onVideoPress()
  }





  render(){
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardMetaData}>
          <TouchableOpacity
            onPress={() => this.onVideoStringPress()}
          >
            {this.createVideoTitle()}
          </TouchableOpacity>
        </View>

        <View style={styles.studyCardMain}>
          <View>
            {this.createCardFrontToNative(this.state.directionToNative)}
          </View>
          <View>
          {this.state.showBack &&
            <View>
              {this.createCardBackToNative(this.state.directionToNative)}
            </View>
          }
          </View>
        </View>
        <View style={styles.gradingButtonContainer}>
        {this.state.showBack &&
          <View style={styles.buttonContainer}>
            <Button
            key={0}
            containerViewStyle={[styles.gradingButtonContainer]}
            buttonStyle={[styles.button, styles.gradingButton,styles.gradingButton0]}
            title={this.state.button0Title}//{I18n.t('retry')}
            onPress={(data) => this.gradeQuestion(0)}
            />
            <Button
            key={1}
            containerViewStyle={[styles.gradingButtonContainer]}
            buttonStyle={[styles.button, styles.gradingButton,styles.gradingButton3]}
            title={this.state.button1Title}//{I18n.t('easy')}
            onPress={(data) => this.gradeQuestion(1)}
            />
          </View>
        }
        {!this.state.showBack &&
          <Button
            loading={false}
            disabled={false}
            buttonStyle={[styles.button, styles.btnFullWidth]}
            title="Show Translation"
            backgroundColor={colors.btnGreen}
            onPress={() => this.showBack()}
          />
        }
        </View>

      </View>
    )
  }

}
