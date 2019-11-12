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

  bookmarkData(scriptIndex){
    var textData = []
    this.parts.map((part, i) => {
      var partData = {}
      if(part.type == "word"){
        partData.text = part.text[scriptIndex]
      }else{
        partData.text = part.text[0]
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
    start: 'int',
    end: 'int',
    video: 'Video',
    parts: {type: 'linkingObjects', objectType: 'CaptionPart', property: 'captionData'},
    bookmarks: {type: 'linkingObjects', objectType: 'Bookmark', property: 'captionData'},

  }
}
