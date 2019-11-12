import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import LanguageHelpers from '../helpers/languageHelpers';
import {styles} from '../styles/styles';


export default class CaptionListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      captionData: this.props.captionData
    }
  }

  componentDidMount() {
  }

  createString(){
    var string = []
    this.state.captionData.textData.map((word, i) => {
      if(word.isBookmarked){
        string.push(<Text key={i} style={[styles.bkmkListText,styles.bkmkActive]}>{word.text}</Text>)
      }else{
        string.push(<Text key={i} style={styles.bkmkListText}>{word.text}</Text>)
      }
    })
    return string
  }

  onTapPress(){
    LanguageHelpers.getTranslation(this.state.captionData.originalText)
    .then((translated) => {
      console.warn(translated)
    })
    .catch((errorMessage) => { console.log(errorMessage) });
  }


  render(){
    return (
      <TouchableOpacity
        style={styles.bkmkListItemContainer}
        onPress={() => this.onTapPress()}
      >
        {this.createString()}
      </TouchableOpacity>
    )
  }

}
