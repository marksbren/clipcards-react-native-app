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

  cardDue(){ // 0 = not due, 1 = toNative due, 2 = toTarget due
    var now = new Date()
    if(this.toNativeNextDueDate < now){
      return 1
    }else if(this.toTargetNextDueDate < now){
      return 2
    }else{
      return 0
    }

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
    if(remainingSeconds < 10){
      timeString += "0"
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

  getScoreCardObject(toNative){
    var response = {}
    if(toNative){
      response = {
        ef: this.toNativeEf,
        interval: this.toNativeInterval,
        reps: this.toNativeReps,
        nextDate: this.toNativeNextDueDate
      }
    }else{
      response = {
        ef: this.toTargetEf,
        interval: this.toTargetInterval,
        reps: this.toTargetReps,
        nextDate: this.toTargetNextDueDate
      }
    }
    return response
  }

}

CaptionData.schema = {
  name: 'CaptionData',
  properties: {
    _id: 'string',
    line: 'string',
    translation: 'string',
    start: 'int',
    end: 'int',
    toNativeEf: {type: 'double', default: 2.5},
    toNativeInterval: {type: 'int', default: 0},
    toNativeReps: {type: 'int', default: 0},
    toNativeNextDueDate: {type: 'date', default: new Date(), indexed: true },
    toTargetEf: {type: 'double', default: 2.5},
    toTargetInterval: {type: 'int', default: 0},
    toTargetReps: {type: 'int', default: 0},
    toTargetNextDueDate: {type: 'date', default: new Date(), indexed: true },
    video: 'Video',
    parts: {type: 'linkingObjects', objectType: 'CaptionPart', property: 'captionData'},
    bookmarks: {type: 'linkingObjects', objectType: 'Bookmark', property: 'captionData'},

  }
}
