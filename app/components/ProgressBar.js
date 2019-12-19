import React from 'react';
import { View, Dimensions } from 'react-native';
import {styles} from '../styles/styles';

const width = Dimensions.get('window').width

export default class ProgressBar extends React.Component {
  render() {
    var currentWidth = this.props.percentage * width
    return(
      <View style={[styles.emptyProgress]}>
        <View style={[styles.currentProgress,{width: currentWidth}]}>
        </View>
      </View>
    )
  }
}
