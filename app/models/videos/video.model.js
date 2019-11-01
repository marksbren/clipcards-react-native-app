import CaptionData from '../captions/captiondata.model';
import Language from '../languages/language.model';

export default class Video {
  get bookmarkKey() {
    return this.captionDataId + '|' + this.captionDataIndex;
  }
}

Video.schema = {
  name: 'Video',
  properties: {
    _id: "string",
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
    captionDatas: {type: 'linkingObjects', objectType: 'CaptionData', property: 'video'}
  }
}
