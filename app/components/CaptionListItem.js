import React from 'react'
import { View, Text } from 'react-native';
import {styles} from '../styles/styles';


export default class CaptionListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      caption: this.props.caption
    }
  }

  componentDidMount() {
  }

  createString(){
    var string = []
    this.state.caption.map((word, i) => {
      if(word.isBookmarked){
        string.push(<Text key={i} style={[styles.bkmkListText,styles.bkmkActive]}>{word.text}</Text>)
      }else{
        string.push(<Text key={i} style={styles.bkmkListText}>{word.text}</Text>)
      }
    })
    return string
  }


  render(){
    return (
      <View style={styles.bkmkListItemContainer}>
        {this.createString()}
      </View>
    )
  }

}
