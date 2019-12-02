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
      directionToNative: true,
      cardData: [],
      language: this.props.language,
      frontData: this.props.frontData,
      button0Title: "",
      button1Title: "",
      button2Title: "",
      button3Title: "",
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
        dataItem.map((word, i) => {
          if(word.isBookmarked){
            response.push(<Text key={j+"|"+i} style={[styles.bkmkListText,styles.bkmkActive]}>{word.text}</Text>)
          }else{
            response.push(<Text key={j+"|"+i} style={styles.bkmkListText}>{word.text}</Text>)
          }
        })
      })
    }else{
      response.push(<Text key='translation' style={[styles.bkmkListText]}>{this.state.caption.translation}</Text>)
    }
    return response
  }

  setButtons(){
    var buttonList = SuperMemo.getScorePreview(this.state.caption.getScoreCardObject(this.state.directionToNative))
    this.setState({
      button0Title: buttonList[0],
      button1Title: buttonList[1],
      button2Title: buttonList[2],
      button3Title: buttonList[3],
    })
  }

  createVideoTitle() {
    var string = []
    string.push(<Text key="title">{this.state.caption.video.shortTitle() + " @ " + this.state.caption.startTimeString()}</Text>)
    return string
  }

  onTapPress(){
    console.warn(this.state.caption.translation)
  }

  gradeQuestion(i){
    // console.warn(this.state.caption.getScoreCardObject(this.state.directionToNative))
    var cardObject = this.state.caption.getScoreCardObject(this.state.directionToNative)
    var newCard = SuperMemo.scoreCard(cardObject,i)
    ModelManager.scoreCaption(this.state.caption,newCard,this.state.directionToNative)
    // this.props.onNext(newCard.interval == 0)
  }

  showBack(){
    this.setState({
      showBack: true
    })
  }




  render(){
    return (
      <View>
        <View style={styles.bkmkListItemContainer}>
          {this.createCardFrontToNative(this.state.directionToNative)}
        </View>

        {this.state.showBack &&
          <View style={styles.bkmkListItemContainer}>
            {this.createCardBackToNative(this.state.directionToNative)}
          </View>
        }
        <View>
          {this.createVideoTitle()}
        </View>
        {this.state.showBack &&
          <View>
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
              buttonStyle={[styles.button, styles.gradingButton,styles.gradingButton1]}
              title={this.state.button1Title}//{I18n.t('hard')}
              onPress={(data) => this.gradeQuestion(1)}
              />
              <Button
              key={2}
              containerViewStyle={[styles.gradingButtonContainer]}
              buttonStyle={[styles.button, styles.gradingButton,,styles.gradingButton2]}
              title={this.state.button2Title}//{I18n.t('medium')}
              onPress={(data) => this.gradeQuestion(2)}
              />
              <Button
              key={3}
              containerViewStyle={[styles.gradingButtonContainer]}
              buttonStyle={[styles.button, styles.gradingButton,styles.gradingButton3]}
              title={this.state.button3Title}//{I18n.t('easy')}
              onPress={(data) => this.gradeQuestion(3)}
              />
            </View>
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
    )
  }

}
