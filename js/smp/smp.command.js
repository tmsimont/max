autowatch = 1;
var repl = new Global("com.ts.repl");

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
function loadbang() {
  repl.register("msmp", function(args, patcher, position) {
    var prefix =      repl.args.require("-p", args);
    var num =         repl.args.argOrDefault("-n", 1, args);
    var pidx =        repl.args.argOrDefault("-i", 0, args);
    var createRecv =  repl.args.argOrDefault("-r", 0, args);
    var connectRecv = repl.args.argOrDefault("-c", 0, args);

    var height = 70;
    var width = 350;
    var x = position.x;
    var y = position.y;

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
            name, // internal receive bang prefix
            prefix // mixdown send name
          ],
          "@embed", 1
          );
      bsmp.rect = [x, y, x + width, y + height];

      if (createRecv != 0) {
        var receiver = patcher.newdefault(0, 0, "receive~", signalName);
        receiver.rect = [x + width + 10, y, x + width + 20, y + 20];
        if (connectRecv != 0) {
          patcher.connect(receiver, 0, patcher.getnamed(connectRecv), 0);
          patcher.connect(receiver, 0, patcher.getnamed(connectRecv), 1);
        }
      }
      pidx++;
    }
  });
}
