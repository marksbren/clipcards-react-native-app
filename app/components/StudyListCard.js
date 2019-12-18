import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';
import {styles} from '../styles/styles';
import {colors} from '../styles/styles';


export default class StudyListCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.language,
    }
  }

  componentDidMount() {
  }

  onTapPress(){
    this.props.onTap()
  }

  render() {
    return (
      <Card
        containerStyle={{marginBottom: 10}}
        title="Today's Review">
        <Text style={{marginBottom: 10}}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='Study Now'
          onPress={() => this.onTapPress()}/>
      </Card>
    )
  }
}
