import React from 'react';
import { Button, Header } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons' //List: https://oblador.github.io/react-native-vector-icons/
import { connectActionSheet } from '@expo/react-native-action-sheet'

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleList: this.props.titleList,
      currentTitleIndex: this.props.currentTitleIndex
    }
  }

  componentDidMount() {

  }

  createTitleButton(){
  }

  changeTitle(i){
    this.props.onTitleChange(i)
    this.setState({
      currentTitleIndex: i
    })
  }

  _onOpenActionSheet(){
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = []

    this.state.titleList.map((title, i) => (
      options.push(title)
    ))
    options.push("Cancel")

    // const destructiveButtonIndex = 0;
    const cancelButtonIndex = this.state.titleList.length;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        if(buttonIndex < this.state.titleList.length){
          this.changeTitle(buttonIndex)
        }
      },
    );
  };

  goBack(){

  }

  render() {
    var title = this.state.titleList[this.state.currentTitleIndex]
    if (this.state.titleList.length > 1) {
      titleItem = <Button
        icon=<Ionicons name="md-arrow-dropdown" size={25} color="#ffffff"/>
        iconRight
        title={title}
        onPress={() => this._onOpenActionSheet()}
      />
    } else {
      titleItem = <Button
        title={title}
      />
    }
    return (
      <Header>
        <Button
          icon=<Ionicons name="logo-youtube" size={25} color="#ffffff"/>
          onPress={() => this.props.onLeftClick()}
        />
        {titleItem}
        <Button
          icon=<Ionicons name="ios-person" size={25} color="#ffffff"/>
          onPress={() => this.enterCode()}
        />
      </Header>
    )
  }
}

export default connectActionSheet(HomeHeader)
