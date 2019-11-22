import CaptionData from '../captions/captiondata.model';
import Language from '../languages/language.model';

export default class Video {
  shortTitle(){
    var string = this.videoTitle.substring(0,10) + "..."
    return string
  }

  bookmarkCount(){
    var bookmarkCount = 0
    this.captionDatas.map((captionData, i) => {
      if(captionData.isBookmarked()){
        bookmarkCount += 1
      }
    })
    return bookmarkCount
  }

  viewPercentage(){
    var percent = 100 * this.previousPlayTime / this.duration
    return Math.floor(percent)
  }
}

Video.schema = {
  name: 'Video',
  properties: {
    _id: "string",
    createdAt: {type: 'date', default: new Date()},
    lastViewedAt: {type: 'date', default: new Date(), indexed: true },
    qualityScore: {type: 'int', default: -1, indexed: true },
    videoId: "string",
    trackKind: "string",
    name: "string",
    audioTrackType: "string",
    isCC: "bool",
    isLarge: "bool",
    isEasyReader: "bool",
    isDraft: "bool",
    isAutoSynced: "bool",
    status: "string",
    captionId: "string",
    videoTitle: "string",
    videoChannel: "string",
    videoThumbnail: "string",
    duration: "double",
    previousPlayTime: "double",
    language: "Language",
    captionLanguage: "string",
    captionDatas: {type: 'linkingObjects', objectType: 'CaptionData', property: 'video'}
  }
}
