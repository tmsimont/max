autowatch = 1;

var seq = new Global("com.ts.seq");
var stateSaver = new Global("com.ts.stateSaver");


function Sequencer(idx, patcher, replace) {
  seq.args = readArgs(seq.argsIn);
  var voices =   require("-v", seq.args);
  var beats =    require("-b", seq.args);
  var sendName = require("-s", seq.args);
  var recvName = require("-r", seq.args);

  var x = 0, y = 0;
  var outputs;
  var driver;
  var visuals = new seq.VisualControls(patcher, x, y + 20, voices, beats);
  var routing = new seq.RoutingControls(patcher, x, y + 20, voices, beats);
  var saver = new stateSaver(patcher, replace);

  //connectRouterToArrayOfMaxObjects(visuals.buttons);

  function connectRouterToArrayOfMaxObjects(maxobjs) {
    // link outs and buttons
    for (var i = 0; i < voices; ++i) {
      patcher.hiddenconnect(routing.router, i, maxobjs[i], 0);
    }
  }

  function createMaxObjectsForVoices(buildObjectAtIdx) {
    var outs = new Array(voices);
    for (var i = 0; i < voices; ++i) {
      outs[i] = buildObjectAtIdx(i);
    }
    connectRouterToArrayOfMaxObjects(outs);
    return outs;
  }

  function OutletOutputs() {
    return createMaxObjectsForVoices(
        function(i) {
          var output =  patcher.newdefault(x + 20 * i, 170, "outlet");
          output.hidden = true;
          return output;
        }
      );
  }

  function SendOutputs(sendName) {
    return createMaxObjectsForVoices(
        function(i) {
          var output =  patcher.newdefault(x + 20 * i, 170, "s", sendName + i);
          output.hidden = true;
          return output;
        }
      );
  }

  outputs = SendOutputs(sendName);

  // connect matrix to router
  patcher.hiddenconnect(visuals.matrix, 0, routing.router, 0);

  // create driver
  driver = new seq.CounterDriver(patcher, beats, routing.route, recvName);

  seq.textedit = patcher.newdefault(0, 0, "textedit", "@keymode", 1, "@wordwrap", 0);
  seq.textedit.rect = [0, 0, 22 + 16 * beats, 20];
  seq.textedit.border(1);
  seq.textedit.rounded(0);
  seq.textedit.set(seq.argsIn);
  patcher.hiddenconnect(seq.textedit, 0, seq.jsthis.box, 0);

  patcher.bringtofront(visuals.matrix);
  patcher.locked = 1;

  this.remove = function() {
    for (var i = 0; i < voices; i++) {
      patcher.remove(outputs[i]);
    }
    patcher.remove(seq.textedit);
    visuals.remove();
    routing.remove();
    saver.remove();
    driver.remove();
  }

  this.replace = function() {
    this.remove();
    main_seq = new seq.Sequencer(0, patcher, true);
  }

  this.saver = saver;
}

