autowatch = 1;
var repl = new Global("com.ts.repl");
repl.commandMap = new Array();

repl.register = function(name, command) {
  repl.commandMap[name] = command;
}

repl.call = function(message, args, patcher) {
  if (repl.commandMap[message]) {
    repl.commandMap[message](
        args,
        patcher,
        repl.objectPositioner.getPosition());
  } else {
    error("Command not recognized");post();
  }
}

/**
 * Listens to everything typed in
 */
function anything() {
  var patcher = this.patcher.parentpatcher;
  var a = arrayfromargs(messagename,arguments);
  var args = repl.args.readArgs(a);
  repl.call(messagename, args, patcher);
}

// helper for positioning objects added...
repl.objectPositioner = new ObjectPositioner();
function ObjectPositioner() {
  var lastY = 0;
  var lastX = 0;
  this.getPosition = function() {
    var position = {
      x: lastX,
      y: lastY
    };
    lastY += 50;
    lastX += 50;
    if (lastY > 500) {
      lastY = 0;
      lastX = 0;
    }
    return position;
  }
}
