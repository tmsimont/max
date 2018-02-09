autowatch = 1;
var bangstaff = new Global("com.ts.bangstaff");
bangstaff.view = bangstaff.view || {};

bangstaff.view.NoteSet = function () {
  var notes = new Array();
  this.toggleNote = function(letter, octave, bend) {
    var arr = new Array();
    var velocity = bangstaff.DEFAULT_VELOCITY;
    var midiIn = bangstaff.midi.getMidi(letter, octave) + bend;
    var already = false;
    for (var i = 0; i < notes.length; i+=2) {
      if (notes[i] == midiIn) {
        already = true;
      }
      else {
        arr.push(notes[i]);
        arr.push(notes[i + 1]);
      }
    }
    if (!already) {
      arr.push(midiIn);
      arr.push(velocity);
    }
    notes = arr;
  }
  this.getNotesArray = function() {
    return notes;
  }
}

