import Video from '../videos/video.model'
import CaptionPart from '../captions/captionpart.model'

export default class CaptionData {
  textString(index) {
    var string = ""
    this.parts.map((part, i) => {
      if(part.type == "word"){
        string += part.text[index]
      }else{
        string += part.text[0]
      }
    })
    return string
  }

  isBookmarked(){
    var isBookmarked = false
    this.bookmarks.map((bookmark, i) => {
      if(bookmark.isActive){
        isBookmarked = true
      }
    })
    return isBookmarked
  }

  startTimeString(){
    var remainingSeconds = Math.floor(this.start / 1000)
    var hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds = remainingSeconds - hours * 3600;
    var minutes = Math.floor(remainingSeconds / 60)
    remainingSeconds = remainingSeconds - minutes * 60

    var timeString = ""
    if(hours > 0){
      timeString += hours + ":"
      timeString += minutes + ":"
    }else if(minutes > 0){
      timeString += minutes + ":"
    }else{
      timeString += "0:"
    }
    timeString += remainingSeconds
    return timeString
  }

  bookmarkData(scriptIndex,insertSpace = false){
    var textData = []

    this.parts.map((part, i) => {
      var partData = {}
      if(part.type == "word"){
        partData.text = part.text[scriptIndex]
      }else{
        partData.text = part.text[0]
      }
      if(insertSpace){
        partData.text += " "
      }
      partData.isBookmarked = false
      textData.push(partData)
    })

    this.bookmarks.map((bookmark, i) => {
      if(bookmark.isActive){
        textData[bookmark.captionDataIndex].isBookmarked = true
      }
    })

    return textData

  }
}

CaptionData.schema = {
  name: 'CaptionData',
  properties: {
    _id: "string",
    line: 'string',
    translation: 'string',
    start: 'int',
    end: 'int',
    video: 'Video',
    parts: {type: 'linkingObjects', objectType: 'CaptionPart', property: 'captionData'},
    bookmarks: {type: 'linkingObjects', objectType: 'Bookmark', property: 'captionData'},

  }
}
