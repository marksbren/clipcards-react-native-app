import {
  StyleSheet,
  StatusBar,
  Dimensions
} from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

let statusBarHeight = 0
if (StatusBar.currentHeight > 0){
  statusBarHeight = StatusBar.currentHeight
}

const containerHeight = height-statusBarHeight

export const colors = {
  btnDefault: '#999999',
  subtitleDefaultText: '#999999',
  lightGray: '#eeeeee',
  btnGreen: '#3AB15C',
  lightGreen: '#90cda8',
  btnYellow: '#D7D03D',
  btnOrange: '#D89650',
  btnRed: '#D84741',
  btnBlue: '#529cde',//'#5496C2',
  white: '#ffffff',
  defaultText: '#333333',
  streak0: '#eeeeee',
  streak1: '#90cda8',
  streak10: '#3AB15C',
  streak100: '#D7D03D',
  streak1000: '#7859B3',
};

export const styles = StyleSheet.create({
  container: {
    width: width,
    height: containerHeight,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  safeArea:{
    flex:1
  },
  youtubeContainer:{
    alignSelf: 'stretch',
    height: 212
  },
  bookmarkedButton: {
    backgroundColor: colors.lightGray
  },
  unbookmarkedButton: {
    backgroundColor: colors.white
  },
  button: {
    height: 60,
    marginBottom:10,
    marginTop:10,
    marginLeft: 0,
    marginRight: 0,
    // alignSelf: 'stretch',
    //backgroundColor: 'rgba(0,0,0,0.2)'
  },
  videoControlContainer:{
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  controlButton:{
    height: 40,
    width: width / 3
  },
  wordButtonContainer:{
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
    marginTop: 20
  },
  wordButton:{
    marginLeft:10,
    marginRight:10
  },
  btnFullWidth: {
    width: width - 20,
    marginLeft: 10,
    marginRight: 10,
  },
})
