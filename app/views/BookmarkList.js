import React from 'react'
import {styles} from '../styles/styles';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import HomeHeader from '../components/HomeHeader';
import CaptionListItem from '../components/CaptionListItem';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import ModelManager from '../models/controller';


export default class BookmarkListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      languageList: ModelManager.languageList(),
      currentLanguageIndex: 0,
      bookmarkList: [],
    }
  }

  componentDidMount() {
    var bookmarkList = ModelManager.bookmarksForLanguage(this.state.languageList[this.state.currentLanguageIndex].code)

    this.setState({
      bookmarkList: bookmarkList
    })
  }

  changeLanguage(i){
    var bookmarkList = ModelManager.bookmarksForLanguage(this.state.languageList[i].code)

    this.setState({
      bookmarkList: bookmarkList,
      currentLanguageIndex: i
    })
  }

  createList(){
    let list = [];
    let lang = this.state.languageList[this.state.currentLanguageIndex].code
    this.state.bookmarkList.map((caption, i) => {
        list.push(
          <CaptionListItem
            key={lang + " " + i}
            caption={caption}
          />
        )
    })
    return list
  }

  render() {
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
          <ScrollView>
              {this.createList()}
          </ScrollView>
        </View>
      </ActionSheetProvider>
    )
  }

}
