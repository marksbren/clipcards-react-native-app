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

  bookmarkData(scriptIndex,insertSpace = false){
    var bookmarkData = {}
    bookmarkData.textData = []
    bookmarkData.originalText = this.line
    bookmarkData._id = this._id

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
      bookmarkData.textData.push(partData)
    })

    this.bookmarks.map((bookmark, i) => {
      if(bookmark.isActive){
        bookmarkData.textData[bookmark.captionDataIndex].isBookmarked = true
      }
    })

    return bookmarkData

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
