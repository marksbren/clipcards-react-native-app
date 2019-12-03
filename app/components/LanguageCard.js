import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';


export default class LanguageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.language,
    }
  }

  componentDidMount() {
    console.warn("mounted")
  }

  onTapPress(){
    this.props.onTap(this.props.listItem)
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onTapPress()}
        >
          <Text>{this.state.language.code}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
