autowatch = 1;
var repl = new Global("com.ts.repl");

function loadbang() {
  repl.register("mnoct", function(args, patcher, position) {
    var start =   repl.args.require("-s", args);
    var prefix =  repl.args.require("-p", args);
    var octaves = repl.args.argOrDefault("-o", 1, args);

    var height = 110;
    var width = 90;
    var x = position.x;
    var y = position.y;

    var majorIntervals = [2,2,1,2,2,2,1];

    var intervals = majorIntervals;
    var idx = 0;
    var note = start;
    for (var i = octaves * intervals.length; i >= 0; i-- ) {
      var bsmp = patcher.newdefault(0, 0, "bpatcher",
          "BangNote",
          "@args", [
          prefix + i, // buffer prefix
          note,
          1 // midi channel
          ],
          "@embed", 1
          );
      bsmp.rect = [x, y, x + width, y + height];
      x += width;
      note += intervals[idx++ % intervals.length]; // starting midi number
    }
  });
}
