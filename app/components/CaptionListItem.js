import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import LanguageHelpers from '../helpers/languageHelpers';
import {styles} from '../styles/styles';


export default class CaptionListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      caption: this.props.caption,
      bookmarkData: this.props.caption.bookmarkData(this.props.script,this.props.needSpaces)
    }
  }

  componentDidMount() {
  }

  createString(){
    var string = []
    this.state.bookmarkData.map((word, i) => {
      if(word.isBookmarked){
        string.push(<Text key={i} style={[styles.bkmkListText,styles.bkmkActive]}>{word.text}</Text>)
      }else{
        string.push(<Text key={i} style={styles.bkmkListText}>{word.text}</Text>)
      }
    })
    return string
  }

  createVideoTitle() {
    var string = []
    string.push(<Text key="title">{this.state.caption.video.shortTitle() + " @ " + this.state.caption.startTimeString()}</Text>)
    return string
  }

  onTapPress(){
    this.props.onTap(this.props.listItem)
  }


  render(){
    return (
      <TouchableOpacity
        onPress={() => this.onTapPress()}
      >
        <View style={styles.bkmkListItemContainer}>
          {this.createString()}
        </View>
        <View>
          {this.createVideoTitle()}
        </View>
      </TouchableOpacity>
    )
  }

}
