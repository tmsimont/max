autowatch = 1;
var bangstaff = new Global("com.ts.bangstaff");
bangstaff.view = bangstaff.view || {};

bangstaff.midi = new bangstaff.MidiLookup();
bangstaff.DEFAULT_VELOCITY = 96;

var createdObjects = new Array();
var theStaff = false;

function staff() {
  if (theStaff === false) {
    theStaff = new bangstaff.Staff(this, this.patcher, 10);
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
        // right arrow
        case -12:
          if (theStaff) theStaff.selectNext();
          break;
        // left arrow
        case -11:
          if (theStaff) theStaff.selectPrev();
          break;
        // down arrow
        case -10:
          if (queuedBend > -1) queuedBend--;
          break;
        // up arrow
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

