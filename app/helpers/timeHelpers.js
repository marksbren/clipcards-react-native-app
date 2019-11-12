
export default class TimeHelper {
  static timeAgoString(dateTime){
    var now = new Date();
    var diff = now - dateTime
    var secondsDiff = diff / 1000
    var timeString = "just now"
    var unitString = "m"
    var agoString = ""
    if(secondsDiff < 60){
      // less than a minute
    }else if(secondsDiff < 60 * 60 ){
      // less than an hour
      timeString = Math.round(secondsDiff/60) + "m ago"
    }else if(secondsDiff < 60 * 60 * 24 ){
      // less than a day
      timeString = Math.round(secondsDiff/60/60) + "h ago"
    }else if(secondsDiff < 60 * 60 * 24 * 30 ){
      // less than a month ago
      timeString = Math.round(secondsDiff/60/60/24) + "d ago"
    }else if(secondsDiff < 60 * 60 * 24 * 365 ){
      // less than a year ago
      timeString = Math.round(secondsDiff/60/60/24) + "mo ago"
    }else{
      timeString = Math.round(secondsDiff/60/60/24/365) + "y ago"
    }

    return timeString
  }


}
