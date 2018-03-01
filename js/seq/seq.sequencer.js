autowatch = 1;
var seq = new Global("com.ts.seq");
var repl = new Global("com.ts.repl");

seq.Sequencer = function(args, main_jsthis, replace) {
  post(main_jsthis);post();
  this.args = args;
  var patcher = main_jsthis.patcher;
  var x = 0, y = 0;
  var outputs;
  var driver;
  var textedit;
  var visuals = new seq.VisualControls(patcher, x, y + 20, args.voices, args.beats);
  var routing = new seq.RoutingControls(patcher, x, y + 20, args.voices, args.beats);
  var saver = new seq.saver(main_jsthis, replace);

  //connectRouterToArrayOfMaxObjects(visuals.buttons);

  function connectRouterToArrayOfMaxObjects(maxobjs) {
    // link outs and buttons
    for (var i = 0; i < args.voices; ++i) {
      patcher.hiddenconnect(routing.router, i, maxobjs[i], 0);
    }
  }

  function createMaxObjectsForVoices(buildObjectAtIdx) {
    var outs = new Array(args.voices);
    for (var i = 0; i < args.voices; ++i) {
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

  outputs = SendOutputs(args.sendName);

  // connect matrix to router
  patcher.hiddenconnect(visuals.matrix, 0, routing.router, 0);

  // create driver
  driver = new seq.CounterDriver(patcher, args.beats, routing.route, args.recvName);

  textedit = patcher.newdefault(0, 0, "textedit", "@keymode", 1, "@wordwrap", 0);
  textedit.rect = [0, 0, 22 + 16 * args.beats, 20];
  textedit.border(1);
  textedit.rounded(0);
  textedit.set(args.argsIn);
  patcher.hiddenconnect(textedit, 0, main_jsthis, 0);

  patcher.bringtofront(visuals.matrix);
  patcher.locked = 1;

  this.remove = function() {
    for (var i = 0; i < args.voices; i++) {
      patcher.remove(outputs[i]);
    }
    patcher.remove(textedit);
    visuals.remove();
    routing.remove();
    saver.remove();
    driver.remove();
  }

  this.saver = saver;
}

