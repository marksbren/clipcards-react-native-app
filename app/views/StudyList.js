import React from 'react'
import {styles} from '../styles/styles';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { ButtonGroup } from 'react-native-elements';
import HomeHeader from '../components/HomeHeader';
import StudyCard from '../components/StudyCard';
import LanguageHelpers from '../helpers/languageHelpers';
import ModelManager from '../models/controller';


export default class StudyList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cardList: [],
      cardsToNative: [],
      currentCardIndex: 0,
      currentLanguageIndex: 0,
      languageList: ModelManager.languageList(),
      cardFrontData: [0],
      buttons: []
    }
  }

  componentDidMount() {
    var cardData = ModelManager.cardsDuesForLanguage(this.state.languageList[this.state.currentLanguageIndex].code)
    var buttons = LanguageHelpers.getScripts(this.state.languageList[this.state.currentLanguageIndex].code)

    this.setState({
      cardList: cardData.captions,
      cardsToNative: cardData.toNative,
      buttons: buttons
    })
  }

  changeLanguage(i){
    var cardData = ModelManager.cardsDuesForLanguage(this.state.languageList[i].code)

    this.setState({
      cardList: cardData.captions,
      cardsToNative: cardData.toNative,
      currentLanguageIndex: i
    })
  }

  selectFrontScript(i){
    this.setState({
      cardFrontData: i
    })
  }

  moveToNextCard(redoCard){
    var newCardList = this.state.cardList
    var newCardsToNative = this.state.cardsToNative
    var newCardIndex = this.state.currentCardIndex
    if(redoCard){
      newCardIndex += 1
    }else{
      newCardList.splice(newCardIndex,1)
      newCardsToNative.splice(newCardIndex,1)
    }

    console.warn("index: "+newCardIndex+" length: "+newCardList.length)

    if(newCardIndex == newCardList.length){
      newCardIndex = 0
    }
    this.setState({
      cardList: newCardList,
      cardsToNative: newCardsToNative,
      currentCardIndex: newCardIndex
    })
  }




  render() {
    var langList = []
    for(var i = 0; i < this.state.languageList.length; i++){
      langList.push(this.state.languageList[i].code)
    }
    let lang = this.state.languageList[this.state.currentLanguageIndex].code
    var currentCaption = this.state.cardList[this.state.currentCardIndex]
    return (
      <ActionSheetProvider>
        <View style={styles.container}>
          <HomeHeader
            titleList={langList}
            currentTitleIndex={this.state.currentLanguageIndex}
            onTitleChange={(i) => this.changeLanguage(i)}
          />
          {LanguageHelpers.hasMultipleScripts(this.state.languageList[this.state.currentLanguageIndex].code) &&
            <ButtonGroup
              onPress={(i) => this.selectFrontScript(i)}
              selectedIndexes={this.state.cardFrontData}
              buttons={this.state.buttons}
              selectMultiple
              containerStyle={styles.scriptSelectorUnselected}
              selectedButtonStyle={styles.scriptSelectorSelected}
              selectedTextStyle={styles.scriptSelectorSelectedText}
            />
          }
          {this.state.cardList.length > 0 &&
            <StudyCard
              key={currentCaption._id + this.state.cardFrontData.toString()}
              caption={currentCaption}
              language={lang}
              frontData={this.state.cardFrontData}
              onNext={(data) => this.moveToNextCard(data)}
            />
          }

        </View>
      </ActionSheetProvider>
    )
  }
}
