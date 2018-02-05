autowatch = 1;
var bangstaff = new Global("bangstaff");

bangstaff.Staff = function(jsthis, patcher, numBeats) {
  var self = this;
  var noteSets = new Array(numBeats);
  var beatDisplays = new Array(noteSets.length);
  var selectedIdx = -1;

  /**
   * Initialize the display and model data structures
   * for each beat.
   */
  // init() {
    for (var i = 0; i < numBeats; i++) {
      beatDisplays[i] = new bangstaff.view.BeatDisplay(jsthis, patcher, i);
      noteSets[i] = new bangstaff.view.NoteSet();
    }

    // show the clef symbols on the first display
    beatDisplays[0].showClefs();
  // }

  /**
   * Toggle a note for the selected beat.
   *
   * @param letter
   *  The a,b,c,d,e,f or g note letter
   * @param octave
   *  The numeric octave
   * @param bend
   *  +1/-1 for sharp/flat
   */
  this.toggleNote = function(letter, octave, bend) {
    if (selectedIdx > -1) {

      // update the data model
      noteSets[selectedIdx].toggleNote(letter, octave, bend);

      // reflect the model in the view
      beatDisplays[selectedIdx].showNotes(
          noteSets[selectedIdx].getNotesArray()
          );
    }
  }

  /**
   * Select the beat at the given index
   */
  this.select = function(idx) {
    if (idx >= 0 && idx < beatDisplays.length) {
      // unselect selected
      if (selectedIdx > -1) {
        beatDisplays[selectedIdx].unselect();
      }

      // select if there's a change
      if (selectedIdx != idx) {
        selectedIdx = idx;
        beatDisplays[selectedIdx].select();

      // else leave unselected
      } else {
        selectedIdx = -1;
      }
    }
  }

  /**
   * Select the next beat
   */
  this.selectNext = function() {
    if (selectedIdx < numBeats) {
      self.select(selectedIdx + 1);
    }
  }

  /**
   * Select the previous beat
   */
  this.selectPrev = function() {
    if (selectedIdx > -1) {
      self.select(selectedIdx - 1);
    }
  }

  this.remove = function() {
    for (var i = 0; i < beatDisplays.length; i++) {
      beatDisplays[i].remove();
    }
  }
}
