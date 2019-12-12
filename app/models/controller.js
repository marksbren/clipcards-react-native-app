import Bookmark from './bookmarks/bookmark.model';
import Video from './videos/video.model';
import Language from './languages/language.model';
import CaptionData from './captions/captiondata.model';
import CaptionPart from './captions/captionpart.model';
import LanguageHelpers from '../helpers/languageHelpers';

const Realm = require('realm')

const realm = new Realm({
  // path: '/Users/marksbren/Downloads/dev.realm',
  schema: [Bookmark,Video,Language,CaptionData,CaptionPart],
  deleteRealmIfMigrationNeeded: true})

export default class ModelManager {
  ///Language Functions
  static languageList(){
    let languages = realm.objects('Language')
    return languages
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


  /// Video functions
  static videoListForLanguage(code){
    let realmLanguage = realm.objects('Language').filtered('code = $0', code)[0]
    return realmLanguage.videos
  }

  static videoBookmarkCount(videoId){
    let realmVideos = realm.objects('Video').filtered('_id = $0', videoId)
    var count = 0
    realmVideos[0].captionDatas.map((captionData, i) => (
      count += captionData.bookmarks.filtered('isActive = true').length
    ))
    return count
  }

  static updateVideoPlayStats(_id, duration, previousPlayTime, finishedWatching){
    let realmVideos = realm.objects('Video').filtered('_id = $0', _id)
    if(realmVideos.length > 0){
      var realmVideo = realmVideos[0]
      realm.write(() => {
        realmVideo.duration = duration;
        realmVideo.previousPlayTime = previousPlayTime;
        realmVideo.finishedWatching = finishedWatching;
        realmVideo.lastViewedAt = new Date();
      });
    }else{
      console.warn("video not saved is trying to update")
    }
  }

  // Not relevant anymore, CaptionData is between videos and bookmarks
  static getVideoForBookmark(id){
    let realmVideos = realm.objects('Video').filtered('_id = $0', id)
    return realmVideos[0] //should never be 0 because should be loaded before bookmarks
  }

  static getVideoForCaption(id){
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
    var realmLanguage = this.getLanguage(video.languageGroup)
    let newVideo = realm.write(() => {
      realm.create('Video', {
        _id: video._id,
        videoId: video.videoId,
        trackKind: video.trackKind,
        language: realmLanguage,
        captionLanguage: video.language,
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

  //// Caption functions
  static scoreCaption(caption,newData,toNative){
    // console.warn(newData)
    realm.write(() => {
      if(toNative){
        caption.toNativeEf = newData.ef
        caption.toNativeInterval = newData.interval
        caption.toNativeReps = newData.reps
        caption.toNativeNextDueDate =  newData.nextDate
      }else{
        caption.toTargetEf = newData.ef
        caption.toTargetInterval = newData.interval
        caption.toTargetReps = newData.reps
        caption.toTargetNextDueDate =  newData.nextDate
      }
    });
  }

  static captionDataExists(id){
    let realmCaptions = realm.objects('CaptionData').filtered('_id = $0', id)
    if(realmCaptions.length == 0){
      return false
    }else{
      return true
    }
  }

  static getCaptionForBookmark(captionData){
    if(!this.captionDataExists(captionData._id)){
      return this.createCaptionObject(captionData)
    }else{
      return realm.objects('CaptionData').filtered('_id = $0', captionData._id)[0]
    }
  }

  static createCaptionObject(captionData){
    var video = this.getVideoForCaption(captionData.videoId)
    var captionObject = {
      _id: captionData._id,
      line: captionData.part,
      translation: "",
      start: captionData.start,
      end: captionData.end,
      parts: captionData.words,
      video: video
    }
    this.setTranslation(captionData)
    return captionObject
  }

  static setTranslation(captionData){
    LanguageHelpers.getTranslation(captionData.part)
    .then((translated) => {
      var insertedCaption = realm.objects('CaptionData').filtered('_id = $0', captionData._id)[0]
      console.warn(translated)
      realm.write(() => {
        insertedCaption.translation = translated
      });
    })
    .catch((errorMessage) => { console.log(errorMessage) });
  }

  static insertCaptionData(captionData){
    var video = this.getVideoForCaption(captionData.videoId)
    try{
      let newCaptionData = realm.write(() => {
        realm.create('CaptionData', {
          _id: captionData._id,
          line: captionData.part,
          start: captionData.start,
          end: captionData.end,
          video: video
        });
      });
      return newCaptionData
    } catch (e) {
      console.warn(e)
    }

  }




  //// Bookmark functions
  static bookmarksForLanguage(lang){
    var response = []
    var realmLanguage = this.getLanguage(lang)
    realmLanguage.videos.map((video, i) => (
      video.captionDatas.map((caption, j) => {
        if(caption.isBookmarked()){
          response.push(caption)
        }
      })
    ))

    return this.sortCaptions(response,true)
  }

  static sortCaptions(list,sortBy){
    var newList = list.sort(function(a, b){return a.getScoreCardObject(true).nextDate-b.getScoreCardObject(true).nextDate})
    return newList
  }

  static cardsDuesForLanguage(lang){
    var response = {
      captions: [],
      toNative: []
    }
    var realmLanguage = this.getLanguage(lang)
    realmLanguage.videos.map((video, i) => (
      video.captionDatas.map((caption, j) => {
        if(caption.isBookmarked()){
          var cardDue = caption.cardDue()
          if(cardDue == 1){
            response.captions.push(caption)
            response.toNative.push(true)
          }else if(cardDue == 2){
            response.captions.push(caption)
            response.toNative.push(false)
          }
        }
      })
    ))
    return response
  }

  static updateBookmark(bookmark,captionData){
    if(!this.captionDataExists(captionData._id)){
      this.insertBookmark(bookmark,captionData)
      return
    }
    var existincCaptionData = this.getCaptionForBookmark(captionData)
    var realmBookmarks = existincCaptionData.bookmarks.filtered('captionDataIndex = $0', bookmark.captionDataIndex)
    if(realmBookmarks.length == 0 ){
      this.insertBookmark(bookmark,captionData)
    }else{
      var newActive = !realmBookmarks[0].isActive
      realm.write(() => {
        realmBookmarks[0].isActive = newActive;
      });
    }
  }

  static insertBookmark(bookmark,captionData){
    var writeParts = false
    if(!this.captionDataExists(captionData._id)){
      writeParts = true
    }
    var newCaptionData = this.getCaptionForBookmark(captionData)
    realm.write(() => {
      let newBookmark = realm.create('Bookmark', {
        tappedIndex: bookmark.tappedIndex,
        captionDataIndex: bookmark.captionDataIndex,
        captionData: newCaptionData,
        isActive: true
      });
      if(writeParts){
        var partCaption = newBookmark.captionData
        captionData.words.map((word, i) => (
          realm.create('CaptionPart', {
            type: word.type,
            text: word.text,
            captionData: partCaption
          })
        ))
      }
    });
    return true
  }

  static bookmarkIsSaved(bookmark){
    if(!this.captionDataExists(bookmark.captionDataId)){
      return false
    }
    let captionData = realm.objects('CaptionData').filtered('_id = $0', bookmark.captionDataId)[0]
    let realmBookmarks = captionData.bookmarks.filtered('captionDataIndex = $0 AND isActive = true', bookmark.captionDataIndex)
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



}
