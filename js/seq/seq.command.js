autowatch = 1;
var repl = new Global("com.ts.repl");
var seq = new Global("com.ts.seq");

seq.valmap = {};
seq.argsIn = [];
seq.args = {};
seq.jsthis = this;
seq.textedit = {};
seq.main_seq = false;
seq.MATRIX_NAME = "main-matrix";


/**
 * mseq command
 * Make a "sequencer" pattern in a BPatcher.
 *
 * This will create an instance of the BSeq in a 
 * BPatcher to show the presentation of a sequencer
 * matrix.
 *
 * Arguments:
 *  -v    the number of voices
 *  -b    the number of beats
 *  -s    the name of the send signal prefix that will
 *        be used in front of a numeric index for voice
 *        number
 *  -r    the name of the receive bang signal to drive
 *        the internal counter
 */
function loadbang() {
  repl.register("mseq", function(args, patcher, position) {
    var voices =   repl.args.require("-v", args);
    var beats =    repl.args.require("-b", args);
    var sendName = repl.args.require("-s", args);
    var recvName = repl.args.require("-r", args);

    var height = 20 * voices + 20;
    var width = 20 + 18 * beats;
    var x = position.x;
    var y = position.y;
    var bseq = patcher.newdefault(0, 0, 
        "bpatcher", 
        "BSeq",
        "@embed", 1);
    bseq.rect = [x, y, x + width, y + height];
    var banger = bseq.subpatcher().getnamed("bangseq");
    seq.main_seq = new seq.Sequencer(args, 0, bseq.subpatcher(), false);
  });
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
