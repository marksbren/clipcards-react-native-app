import React from 'react'
import {styles} from '../styles/styles';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { ButtonGroup } from 'react-native-elements';
import HomeHeader from '../components/HomeHeader';
import StudyCard from '../components/StudyCard';
import LanguageHelpers from '../helpers/languageHelpers';
import ModelManager from '../models/controller';


export default class StudyCards extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cardList: [],
      cardsToNative: [],
      language: this.props.navigation.state.params.language,
      currentCardIndex: 0,
      cardFrontData: [0],
      buttons: []
    }
  }

  componentDidMount() {
    var cardData = ModelManager.cardsDuesForLanguage(this.state.language.code)
    var buttons = LanguageHelpers.getScripts(this.state.language.code)

    this.setState({
      cardList: cardData.captions,
      cardsToNative: cardData.toNative,
      buttons: buttons
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

    if(newCardIndex == newCardList.length){
      newCardIndex = 0
    }
    this.setState({
      cardList: newCardList,
      cardsToNative: newCardsToNative,
      currentCardIndex: newCardIndex
    })
  }


  goBack(){
    this.props.navigation.goBack()
    // if(this.state.selectedLanguage.length > 0 && this.props.navigation.state.params.onGoBack){
    //   this.props.navigation.state.params.onGoBack(this.state.selectedLanguage)
    //   this.props.navigation.goBack()
    // }else{
    //   this.props.navigation.goBack()
    // }
  }




  render() {
    let lang = this.state.language.code
    var currentCaption = this.state.cardList[this.state.currentCardIndex]
    return (
      <ActionSheetProvider>
        <View style={styles.container}>
          <HomeHeader
            titleList={[]}
            currentTitleIndex={0}
            onLeftClick={() => this.goBack()}
          />
          {LanguageHelpers.hasMultipleScripts(this.state.language.code) &&
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
