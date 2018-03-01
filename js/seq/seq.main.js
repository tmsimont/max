autowatch = 1;
var seq = new Global("com.ts.seq");

seq.MATRIX_NAME = "main-matrix";

var jsthis = this;
var valmap = {};
var main_seq = false;

function make() {
  var a = arrayfromargs(messagename,arguments);
  post(a);post();
  a.shift();
  // TODO: how to message() a full array or object?
  var reformatted = [
    "-v", a[0],
    "-b", a[1],
    "-s", a[2],
    "-r", a[3]
  ];
  var args = new seq.Args(reformatted);
  main_seq = new seq.Sequencer(args, jsthis, false);
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

function anything() {
  post("anything?");post();
}

function text() {
  post("text?");post();
  var a = arrayfromargs(messagename,arguments);
  // TODO: validate args first
  a.shift();
  var args = new seq.Args(a);
  if (main_seq) {
    main_seq.remove();
    main_seq = new seq.Sequencer(args, jsthis, true);
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
    main_seq = new seq.Sequencer(args, jsthis, true);
  }
}
