autowatch = 1;
var repl = new Global("com.ts.repl");

function loadbang() {
  repl.register("orch", function(args, patcher, position) {
    var height = 200;
    var width = 85;
    var x = position.x;
    var y = position.y;
    var orch = patcher.newdefault(0, 0, "bpatcher",
        "Orch",
        "@embed", 1
        );
    orch.rect = [x, y, x + width, y + height];
  });
}
