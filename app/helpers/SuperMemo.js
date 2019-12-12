var today = new Date();
var scores = [2,4]

export default class SuperMemo {

  static scoreCard(card,buttonNumber){
    var grade = scores[buttonNumber]
    var newCard = this.calcIntervalEF(card,grade)
    return newCard
  }

  // Briefly the algorithm works like this:
  // EF (easiness factor) is a rating for how difficult the card is.
  // Grade: (0-2) Set reps and interval to 0, keep current EF (repeat card today)
  //        (3)   Set interval to 0, lower the EF, reps + 1 (repeat card today)
  //        (4-5) Reps + 1, interval is calculated using EF, increasing in time.
  static calcIntervalEF(card, grade) {
    var newCard = Object.assign({}, card)
    var oldEF = newCard.ef,
        newEF = 0,
        nextDate = new Date(today);

    if (grade < 3) {
      newCard.reps = 0;
      newCard.interval = 0;
    } else {

      newEF = oldEF + (0.1 - (5-grade)*(0.08+(5-grade)*0.02));
      if (newEF < 1.3) { // 1.3 is the minimum EF
        newCard.ef = 1.3;
      } else {
        newCard.ef = newEF;
      }

      newCard.reps = newCard.reps + 1;

      switch (newCard.reps) {
        case 1:
          newCard.interval = 1 * (grade - 3);
          break;
        case 2:
          newCard.interval = 3 * (grade - 3);
          break;
        default:
          newCard.interval = Math.ceil((newCard.reps - 1) * newCard.ef);
          break;
      }
    }

    if (grade === 3) {
      newCard.interval = 0;
    }

    nextDate.setDate(today.getDate() + newCard.interval);
    newCard.nextDate = nextDate;
    return newCard;
  }

  static getScorePreview(card){
    // console.warn(card)
    var intervals = [0,0]

    scores.forEach(function(score,index) {
      var newCard = SuperMemo.calcIntervalEF(card,score)
      //TODO fix multiple 0s
      if(index === 0 && newCard.interval === 0){
       intervals[index] = "1m"
      }else if(index === 1 && newCard.interval === 0){
       intervals[index] = "10m"
      }else{
       intervals[index] = newCard.interval + "d"
      }
    })

    return intervals
  }
}
