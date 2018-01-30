autowatch = 1;

var jsthis = this;

var createdObjects = new Array();
var theStaff = false;

function staff() {
  if (theStaff === false) {
    theStaff = new Staff(this.patcher, 10);
    createdObjects.push(theStaff);
  }
}

function selectBeat(idx) {
  if (theStaff) {
    theStaff.select(idx);
  }
}

var chars = ['a','b','c','d','e','f','g'];
var queuedChar = false;
var queuedBend = 0;
function ascii(i) {
  if (theStaff) {
    if (i == 30 || i == 31) {
      // do nothing for arrows

    // character
    } else if (i > 96 && i < 104) {
      var c = chars[i-97];
      queuedChar = c;
      queuedBend = 0;

    // number
    } else if (i > 48 && i < 58) {
      var n = i - 48;
      if (queuedChar) {
        theStaff.toggleNote(queuedChar, n, queuedBend);
        queuedChar = false;
        queuedBend = 0;
      }

    } else {
      queuedChar = false;
      queuedBend = 0;
    }

  }
}

function anything() {
  var a = arrayfromargs(messagename,arguments);
  switch(messagename) {
    case "keypress":
      switch (a[1]) {
        case -12:
          if (theStaff) theStaff.selectNext();
          break;
        case -11:
          if (theStaff) theStaff.selectPrev();
          break;
        case -10:
          if (queuedBend > -1) queuedBend--;
          break;
        case -9:
          if (queuedBend < 1) queuedBend++;
          break;
      }
      break;
    default:
      break;
  }
}

function clear() {
  for (var i = 0; i < createdObjects.length; i++) {
    createdObjects[i].remove();
  }
  theStaff = false;
  createdObjects = new Array();
}

function Staff(patcher, numBeats) {
  var self = this;
  var noteSets = new Array(numBeats);
  var beatDisplays = new Array(noteSets.length);
  var selectedIdx = -1;

  // init views
  for (var i = 0; i < noteSets.length; i++) {
    beatDisplays[i] = new BeatDisplay(i);
  }
  beatDisplays[0].showClefs();

  // init data
  for (var i = 0; i < numBeats; i++) {
    noteSets[i] = new NoteSet();
  }

  this.toggleNote = function(letter, octave, bend) {
    if (selectedIdx > -1) {
      noteSets[selectedIdx].toggleNote(letter, octave, bend);
      beatDisplays[selectedIdx].showNotes(
          noteSets[selectedIdx].getNotesArray()
          );
    }
  }

  this.selectNext = function() {
    if (selectedIdx < numBeats) {
      self.select(selectedIdx + 1);
    }
  }

  this.selectPrev = function() {
    if (selectedIdx > -1) {
      self.select(selectedIdx - 1);
    }
  }

  this.select = function(idx) {
    if (idx >= 0 && idx < beatDisplays.length) {
      if (selectedIdx > -1) {
        beatDisplays[selectedIdx].unselect();
      }
      if (selectedIdx != idx) {
        selectedIdx = idx;
        beatDisplays[selectedIdx].select();
      } else {
        selectedIdx = -1;
      }
    }
  }

  this.remove = function() {
    for (var i = 0; i < beatDisplays.length; i++) {
      beatDisplays[i].remove();
    }
  }

  var midi = new MidiNoteSet();
  var DEFAULT_VELOCITY = 96;
  function NoteSet() {
    var notes = new Array();
    this.toggleNote = function(letter, octave, bend) {
      var arr = new Array();
      var velocity = DEFAULT_VELOCITY;
      var midiIn = midi.getMidi(letter, octave) + bend;
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

  function MidiNoteSet() {
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

  function BeatDisplay(idx) {
    var beatWidth = 60,
    offset = 30,
    measureHeight = 200;
    var x = beatWidth + idx * offset - 60;
    var nslider = patcher.newdefault(x, 0, "nslider");
    nslider.rect = [x, 0, x + beatWidth, measureHeight];
    nslider.rounded = 0;
    nslider.bordercolor(255, 255, 255, 0);
    nslider.bgcolor(255, 255, 255, 0);
    nslider.clefs(0);
    nslider.mode(1);

    var select = patcher.newdefault(x, 0, "button");
    select.rect = [x + 35, measureHeight, x + beatWidth, measureHeight + 10];
    var smess = patcher.newdefault(x, 0, "message");
    smess.set("selectBeat", idx);
    smess.hidden = 1;
    patcher.hiddenconnect(select, 0, smess, 0);
    patcher.hiddenconnect(smess, 0, jsthis.box, 0);

    this.showClefs = function() {
      nslider.clefs(1);
    }

    var line = false;
    this.showRightLine = function() {
      line = patcher.newdefault(x, 0, "panel");
      line.rect = [x + beatWidth, 0, x + beatWidth + 1, measureHeight];
      line.rounded(0);
    }

    this.select = function() {
      nslider.bgcolor(255, 150, 0, 1);
    }

    this.unselect = function() {
      nslider.bgcolor(255, 255, 255, 0);
    }

    this.showNotes = function(notes) {
      nslider.flush();
      nslider.chord(notes);
    }

    this.remove = function() {
      if (line) patcher.remove(line);
      patcher.remove(nslider);
      patcher.remove(select);
      patcher.remove(smess);
    }
  }
}
