import React from 'react'
import {styles} from '../styles/styles';
import { Alert, Clipboard, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { ButtonGroup } from 'react-native-elements';
import HomeHeader from '../components/HomeHeader';
import LanguageCard from '../components/LanguageCard';

import LanguageHelpers from '../helpers/languageHelpers';
import ModelManager from '../models/controller';


export default class StudyTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      languageList: ModelManager.languageList()
    }
  }

  componentDidMount() {

  }

  selectLanguage(i){
    var language = this.state.languageList[i]
    this.props.navigation.navigate("studyCards",{
      language: language})
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
            titleList={[]}
            currentTitleIndex={0}
          />
          {this.state.languageList.map((lang, i) => (
              <LanguageCard
                key={i}
                listItem={i}
                language={lang}
                onTap={(i) => this.selectLanguage(i)}
              />
            ))
          }
        </View>
      </ActionSheetProvider>
    )
  }
}
