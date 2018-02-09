autowatch = 1;
var repl = new Global("com.ts.repl");

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
    banger.message("makeSeq", voices, beats, sendName, recvName);
  });
}

