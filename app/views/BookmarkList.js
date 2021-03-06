import React from 'react'
import {styles} from '../styles/styles';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import HomeHeader from '../components/HomeHeader';
import CaptionListItem from '../components/CaptionListItem';
import LanguageHelpers from '../helpers/languageHelpers';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import ModelManager from '../models/controller';


export default class BookmarkListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      languageList: ModelManager.languageList(),
      currentLanguageIndex: 0,
      currentScriptIndex: 0,
      bookmarkList: [],
    }
  }

  componentDidMount() {
    var bookmarkList = ModelManager.bookmarksForLanguage(this.state.languageList[this.state.currentLanguageIndex].code,this.state.currentScriptIndex)

    this.setState({
      bookmarkList: bookmarkList
    })
  }

  changeLanguage(i){
    var bookmarkList = ModelManager.bookmarksForLanguage(this.state.languageList[i].code,this.state.currentScriptIndex)

    this.setState({
      bookmarkList: bookmarkList,
      currentLanguageIndex: i,
      currentScriptIndex: 0
    })
  }

  createList(){
    let list = [];
    let lang = this.state.languageList[this.state.currentLanguageIndex].code
    let needSpaces = LanguageHelpers.languageScriptNeedsSpaces(lang,this.state.currentScriptIndex)
    this.state.bookmarkList.map((caption, i) => {
        list.push(
          <CaptionListItem
            key={lang + " " + this.state.currentScriptIndex + " " + i}
            listItem={i}
            caption={caption}
            language={lang}
            needSpaces={needSpaces}
            script={this.state.currentScriptIndex}
            onTap={(i) => this.selectCard(i)}
          />
        )
    })
    return list
  }

  changeScript(i){
    var bookmarkList = ModelManager.bookmarksForLanguage(this.state.languageList[this.state.currentLanguageIndex].code,i)

    this.setState({
      currentScriptIndex: i,
      bookmarkList: bookmarkList
    })
  }

  selectCard(i){
    var language = this.state.languageList[this.state.currentLanguageIndex]
    var cardList = [this.state.bookmarkList[i]]
    var toNative = [true]
    var cardData = {
      toNative: toNative,
      captions: cardList
    }
    this.props.navigation.navigate("studyCards",{
      language: language,
      cardData: cardData
    })
  }

  render() {
    const buttons = LanguageHelpers.getScripts(this.state.languageList[this.state.currentLanguageIndex].code)
    var langList = []
    for(var i = 0; i < this.state.languageList.length; i++){
      langList.push(this.state.languageList[i].code)
    }
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
              onPress={(i) => this.changeScript(i)}
              selectedIndex={this.state.currentScriptIndex}
              buttons={buttons}
              containerStyle={styles.scriptSelectorUnselected}
              selectedButtonStyle={styles.scriptSelectorSelected}
              selectedTextStyle={styles.scriptSelectorSelectedText}
            />
          }
          <ScrollView>
              {this.createList()}
          </ScrollView>
        </View>
      </ActionSheetProvider>
    )
  }

}
