import CaptionData from '../captions/captiondata.model';

export default class CaptionPart {
  get bookmarkKey() {
    return this.captionDataId + '|' + this.captionDataIndex;
  }
}

CaptionPart.schema = {
  name: 'CaptionPart',
  properties: {
    type: 'string',
    text: 'string[]',
    captionData: 'CaptionData'
  }
}
