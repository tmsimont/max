autowatch = 1;
var repl = new Global("com.ts.repl");
var seq = new Global("com.ts.seq");

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
    var seqArgs = new seq.Args(args._argsIn);
    var height = 20 * seqArgs.voices + 20;
    var width = 20 + 18 * seqArgs.beats;
    var x = position.x;
    var y = position.y;
    var bseq = patcher.newdefault(0, 0, 
        "bpatcher", 
        "BSeq",
        "@embed", 1);
    bseq.rect = [x, y, x + width, y + height];
    var banger = bseq.subpatcher().getnamed("main");
    var ms = new seq.Sequencer(seqArgs, banger, false);
    /*
    banger.message("make", 
        seqArgs.voices,
        seqArgs.beats,
        seqArgs.sendName,
        seqArgs.recvName);
        */
  });
}

seq.Args = function(args) {
  var read = repl.args.readArgs(args);
  this.voices =   repl.args.require("-v", read);
  this.beats =    repl.args.require("-b", read);
  this.sendName = repl.args.require("-s", read);
  this.recvName = repl.args.require("-r", read);
  this.argsIn = args;
}
