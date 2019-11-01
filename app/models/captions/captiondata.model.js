import Video from '../videos/video.model';
import Bookmark from '../bookmarks/bookmark.model';

export default class CaptionData {
  get bookmarkKey() {
    return this.captionDataId + '|' + this.captionDataIndex;
  }
}

CaptionData.schema = {
  name: 'CaptionData',
  properties: {
    _id: "string",
    line: 'string',
    start: 'int',
    end: 'int',
    parts: 'string[]',
    video: 'Video',
    bookmarks: {type: 'linkingObjects', objectType: 'Bookmark', property: 'captionData'}
  }
}
