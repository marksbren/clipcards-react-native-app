import Bookmark from './bookmarks/bookmark.model';
import Video from './videos/video.model';
import Language from './languages/language.model';

const Realm = require('realm')

const realm = new Realm({
  path: '/Users/marksbren/Downloads/dev.realm',
  schema: [Bookmark,Video,Language],
  deleteRealmIfMigrationNeeded: true})

export default class ModelManager {
  static updateBookmark(bookmark){
      var realmBookmark = this.getBookmark(bookmark)
      if(realmBookmark === null ){
        this.insertBookmark(bookmark)
      }else{
        var newActive = !realmBookmark.isActive
        realm.write(() => {
          realmBookmark.isActive = newActive;
        });
      }
  }

  static insertBookmark(bookmark){
    var video = this.getVideoForBookmark(bookmark.videoId)
    let newBookmark = realm.write(() => {
      realm.create('Bookmark', {
        tappedIndex: bookmark.tappedIndex,
        captionDataIndex: bookmark.captionDataIndex,
        captionDataId: bookmark.captionDataId,
        video: video,
        isActive: bookmark.isActive
      });
    });
    return true
  }

  static bookmarkIsSaved(bookmark){
    let realmBookmarks = realm.objects('Bookmark').filtered('captionDataIndex = $0 AND captionDataId = $1 AND isActive = true', bookmark.captionDataIndex, bookmark.captionDataId)
    if(realmBookmarks.length > 0){
      return true
    }else{
      return false
    }
  }

  static bookmarksForCaptionId(captionId){
    let bookmarks = realm.objects('Bookmark').filtered('captionDataId = $0  AND isActive = true', captionId)
    return bookmarks
  }

  static getBookmark(bookmark){
    let realmBookmark = realm.objects('Bookmark').filtered('captionDataIndex = $0 AND captionDataId = $1', bookmark.captionDataIndex, bookmark.captionDataId)
    if(realmBookmark.length > 0){
      return realmBookmark[0]
    }else{
      return null
    }
  }

  static videoBookmarkCount(videoId){
    let realmVideos = realm.objects('Video').filtered('_id = $0', videoId)
    let realmBookmarks = realmVideos[0].bookmarks.filtered('isActive = true')
    return realmBookmarks.length
  }

  static updateVideoPlayStats(_id, duration, previousPlayTime, finishedWatching){
    let realmVideos = realm.objects('Video').filtered('_id = $0', _id)
    if(realmVideos.length > 0){
      var realmVideo = realmVideos[0]
      realm.write(() => {
        realmVideo.duration = duration;
        realmVideo.previousPlayTime = previousPlayTime;
        realmVideo.finishedWatching = finishedWatching;
      });
    }else{
      console.warn("video not saved is trying to update")
    }
  }

  static getVideoForBookmark(id){
    let realmVideos = realm.objects('Video').filtered('_id = $0', id)
    return realmVideos[0] //should never be 0 because should be loaded before bookmarks
  }

  static loadVideo(video){
    let realmVideos = realm.objects('Video').filtered('_id = $0', video._id)
    if(realmVideos.length > 0){
      return realmVideos[0]
    }else{
      video.duration = 0
      video.previousPlayTime = 0
      video.finishedWatching = false
      this.insertVideo(video)
      return video
    }
  }

  static insertVideo(video){
    let newVideo = realm.write(() => {
      var realmLanguage = this.getLanguage(video.language)
      realm.create('Video', {
        _id: video._id,
        videoId: video.videoId,
        trackKind: video.trackKind,
        language: realmLanguage,
        name: video.name,
        audioTrackType: video.audioTrackType,
        isCC: video.isCC,
        isLarge: video.isLarge,
        isEasyReader: video.isEasyReader,
        isDraft: video.isDraft,
        isAutoSynced: video.isAutoSynced,
        status: video.status,
        captionId: video.captionId,
        videoTitle: video.videoTitle,
        videoChannel: video.videoChannel,
        videoThumbnail: video.videoThumbnail,
        duration: 0,
        previousPlayTime: 0,
        finishedWatching: false
      });
    });
    return newVideo
  }

  static getLanguage(code){
    let realmLanguage = realm.objects('Language').filtered('code = $0', code)
    if(realmLanguage.length > 0){
      return realmLanguage[0]
    }else{
      return {code: code}
    }
  }

  static insertLanguage(languageCode){
    let newLanguage = realm.write(() => {
      realm.create('Language', {
        code: languageCode
      });
    });
    return newLanguage
  }



}
