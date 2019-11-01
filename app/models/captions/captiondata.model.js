import Video from '../videos/video.model'
import CaptionPart from '../captions/captionpart.model'

export default class CaptionData {
  textString(index) {
    var string = ""
    this.parts.map((part, i) => {
      if(part.type == "word"){
        string += part[index]
      }else{
        string += part[0]
      }
    })
    return string
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
