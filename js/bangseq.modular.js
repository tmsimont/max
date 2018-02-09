autowatch = 1;

var seq = new Global("com.ts.seq");

seq.valmap = {};
seq.argsIn = [];
seq.args = {};
seq.jsthis = this;
seq.textedit;
seq.main_seq = false;

function makeSeq() {
  var a = arrayfromargs(messagename,arguments);
  make(a[1], a[2], a[3], a[4]);
}

function make(voices, beats, sendName, recvName) {
  seq.argsIn = [
    "-r", recvName,
    "-s", sendName,
    "-v", voices,
    "-b", beats
  ];
  seq.main_seq = new seq.Sequencer(0, this.patcher, false);
}

//-------------------------------------------------------
// Begin indvidual sequencer instance code
//-------------------------------------------------------

// matrix name does not seem to have to be unique in multiple sequencers...
seq.MATRIX_NAME = "main-matrix";



function text() {
  var a = arrayfromargs(messagename,arguments);
  // TODO: validate args first
  a.shift();
  seq.argsIn = a;
  if (seq.main_seq) {
    seq.main_seq.replace();
  } else {
    // remove everything except this js object
    var obj = this.patcher.firstobject;
    do {
      if (obj.js != seq.jsthis) {
        var temp = obj.nextobject;
        this.patcher.remove(obj);
        obj = temp;
      } else {
        obj = obj.nextobject;
      }
    } while (obj);
    // new sequencer from scratch, loading valmap
    seq.main_seq = new Sequencer(0, this.patcher, true);
  }
}

function saveToMap() {
  var a = arrayfromargs(messagename,arguments);
  var row = a[1];
  var col = a[2];
  var val = a[3];
  seq.valmap[hash(row,col)] = val;
}

function hash(row, col) {
  return row + "-" + col;
}

/**
 * Helper to parse args passed into textbox
 */
function readArgs(a) {
  var args = {};
  if (a.length > 2) {
    // args must be in -flag val format
    for (var i = 0; i < a.length; i+=2) {
      args[a[i]] = a[i+1];
    }
  }
  return args;
}

/**
 * Helper to give me the arg in the args
 * map or throw an error if not present
 */
function require(arg, args) {
  if (typeof(args[arg]) == "undefined") {
    throw arg + " is required";
  }
  return args[arg];
}
