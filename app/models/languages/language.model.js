import Video from '../videos/video.model';

export default class Language {
  get prettyPrint() {
    return "this is pretty";
  }
}

Language.schema = {
  name: 'Language',
  properties: {
    code: 'string',
    videos: {type: 'linkingObjects', objectType: 'Video', property: 'language'}
  }
}
