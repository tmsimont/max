// helper for positioning objects added...
var lastY = 0;

/**
 * Listens to everything typed in
 */
function anything() {
  error("Undefined command");post();
}

/**
 * Helper to parse args passed into textbox
 */
function readArgs(a) {
  var cmdname = a[1];
  var args = {};
  if (a.length > 2) {
    // args must be in -flag val format
    for (var i = 1; i < a.length; i+=2) {
      args[a[i]] = a[i+1];
    }
  }
  return args;
}

/**
 * Helper to give me the arg in the args
 * map or a default value if not present
 */
function argOrDefault(arg, def, args) {
  if (typeof(args[arg]) == "undefined") {
    return def;
  }
  return args[arg];
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
function mseq() {
  var a = arrayfromargs(messagename,arguments);
  var args = readArgs(a);
  var patcher = this.patcher.parentpatcher;

  var voices =   require("-v", args);
  var beats =    require("-b", args);
  var sendName = require("-s", args);
  var recvName = require("-r", args);

  var height = 20 * voices + 20;
  var width = 20 + 18 * beats;
  var x = 0;
  var bseq = patcher.newdefault(0, 0, 
      "bpatcher", 
      "BSeq",
      "@embed", 1);
  bseq.rect = [x, lastY, x + width, lastY + height];
  lastY += height;
  var banger = bseq.subpatcher().getnamed("bangseq");
  banger.message("makeSeq", voices, beats, sendName, recvName);
}


/**
 * msmp command
 * Make a "bang sample" in a BPatcher.
 *
 * This will create an instance of the TxtBangSamp in a 
 * BPatcher to show the presentation of a textbox bang
 * sampler.
 *
 * Arguments:
 *  -p    the receive and send name prefixes
 *  -n    the number of bang samplers to create
 *  -i    the starting index to add to multiple samplers names
 *  -r    non-zero value indicates we want a receive created
 *  -c    required with -r, a name for an ezdac to connect to
 */
function msmp() {
  var a = arrayfromargs(messagename,arguments);
  var args = readArgs(a);
  var patcher = this.patcher.parentpatcher;

  var prefix = require("-p", args);
  var num = argOrDefault("-n", 1, args);
  var pidx = argOrDefault("-i", 0, args);
  var createRecv = argOrDefault("-r", 0, args);
  var connectRecv = argOrDefault("-c", 0, args);

  var height = 70;
  var width = 350;
  var x = 0;

  for (var i = 0; i < num; ++i) {
    var idx = pidx;
    var name = prefix + idx;
    var signalName = "signal-" + name;
    var bufferName = "buffer-" + name;

    var bsmp = patcher.newdefault(0, 0, "bpatcher",
        "TxtBangSamp",
        "@args", [
          bufferName, // buffer prefix
          signalName, // sample signal send prefix
          name // internal receive bang prefix
        ],
        "@embed", 1
        );
    bsmp.rect = [x, lastY, x + width, lastY + height];

    if (createRecv != 0) {
      var receiver = patcher.newdefault(0, 0, "r", signalName);
      receiver.rect = [x + width + 10, lastY, x + width + 20, lastY + 20];
      if (connectRecv != 0) {
        patcher.connect(receiver, 0, patcher.getnamed(connectRecv), 0);
        patcher.connect(receiver, 0, patcher.getnamed(connectRecv), 1);
      }
    }

    lastY += height;
    pidx++;
  }
}

function orch() {
  var height = 200;
  var width = 85;
  var x = 0;
  var patcher = this.patcher.parentpatcher;

  var orch = patcher.newdefault(0, 0, "bpatcher",
      "Orch",
      "@embed", 1
      );
  orch.rect = [x, 0, x + width, height];

}
