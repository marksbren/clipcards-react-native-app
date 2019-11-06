import CaptionData from '../captions/captiondata.model';

export default class Bookmark {
  get bookmarkKey() {
    return this.captionDataId + '|' + this.captionDataIndex;
  }
}

Bookmark.schema = {
  name: 'Bookmark',
  properties: {
    tappedIndex: {type: 'int', default: 0},
    captionDataIndex: {type: 'int', default: 0},
    captionData: 'CaptionData',
    isActive: {type: 'bool', default: true},
    isSynced: {type: 'bool', default: false},
  }
}
