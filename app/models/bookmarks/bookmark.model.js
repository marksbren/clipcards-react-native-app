import Video from '../videos/video.model';

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
    captionDataId: {type: 'string', indexed: true},
    video: 'Video',
    isActive: 'bool',
    isSynced: {type: 'bool', default: false},
  }
}
