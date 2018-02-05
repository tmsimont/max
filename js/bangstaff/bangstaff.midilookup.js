autowatch = 1;
var bangstaff = new Global("bangstaff");

bangstaff.MidiLookup = function() {
  var m = 36; // low midi note
  var mi = 0;
  var interval = [2, 2, 1, 2, 2, 2, 1];
  var range = 9;
  var lookup = {};
  var letters = ["c","d","e","f","g","a","b"];
  var li = 0;

  for (var i = 0; i < letters.length; i++) {
    lookup[letters[i]] = new Array(range);
  }

  for (var i = 1; i <= range; i++) {
    for (var j = 0; j < letters.length; j++) {
      lookup[letters[j]][i] = m;
      m  = m + interval[mi];
      mi = (mi + 1) % interval.length;
    }
  }

  this.getMidi = function(letter, octave) {
    return lookup[letter][octave];
  }
}
