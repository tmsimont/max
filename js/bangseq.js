var main_seq = false;

function reload() {
  main_seq = true;
}

function makeSeq() {
  var a = arrayfromargs(messagename,arguments);
  make(a[1], a[2], a[3], a[4]);
}

//-------------------------------------------------------
// Sequence "manager" code: parent creates subpatchers
//-------------------------------------------------------

function make(voices, beats, sendName, recvName) {
  main_seq = new Sequencer(0, this.patcher, voices, beats, sendName, recvName);
}

function save() {
  // TODO: save and restore the current seq index
}

// TODO: break out individual sequencers into some kind of subpatcher...

//-------------------------------------------------------
// Begin indvidual sequencer instance code
//-------------------------------------------------------

// matrix name does not seem to have to be unique in multiple sequencers...
var MATRIX_NAME = "main-matrix";


/**
 * Sequencer "class"
 */ 
function Sequencer(idx, patcher, voices, beats, sendName, recvName) {
  var x = 0, y = 0;
  var outputs;
  var driver;
  var visuals = new VisualControls(patcher, x, y + 20, voices, beats);
  var routing = new RoutingControls(patcher, x, y + 20, voices, beats);
  var saver = new StateSaver(patcher);

  connectRouterToArrayOfMaxObjects(visuals.buttons);

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
  driver = new CounterDriver(patcher, beats, routing.route, recvName);

  var comment = patcher.newdefault(0, 0, "comment");
  comment.set("r: " + recvName + "; s: " + sendName);

  patcher.bringtofront(visuals.matrix);
  patcher.locked = 1;
}

function VisualControls(patcher, x, y, voices, beats) {
  var matrix, 
    pasteCheck,
    buttons;

  // create matrix and side buttons
  matrix = patcher.newdefault(20 + x, y, "matrixctrl");
  matrix.rows(voices);
  matrix.columns(beats);
  matrix.scale(false);
  matrix.autosize(true);
  matrix.varname = MATRIX_NAME;

  // this bangs the matrix on load and on copy/paste to make sure 
  // the values restored in the StateSaver are applied to the 
  // connected routing elements
  pasteCheck = patcher.newdefault(
      20,
      20,
      "js",
      "pastecheck.js",
      MATRIX_NAME);
  pasteCheck.hidden = true;

  buttons = new Array(voices);
  for (var i = 0; i < voices; ++i) {
    buttons[i] = patcher.newdefault(x, y + 16 * i, "button");
  }

  // publish elements
  this.matrix = matrix;
  this.buttons = buttons;
}

function RoutingControls(patcher, x, y, voices, beats) {
  var route, router;
  // create route
  var route_outs = new Array(beats);
  for (var i = 0; i < beats; ++i) {
    route_outs[i] = i + 1;
  }
  route  = patcher.newdefault(30, 70, "route", route_outs);
  route.hidden = true;

  // create router
  router = patcher.newdefault(x, 100, "router", beats, voices);
  router.hidden = true;

  // connect route to router
  for (var i = 0; i < beats; ++i) {
    patcher.hiddenconnect(route, i, router, i + 1);
  }

  // publish elements
  this.route = route;
  this.router = router;
}

/**
 * Counter based sequencer driver.
 * Allows an external bang to push through our steps.
 */ 
function CounterDriver(patcher, beats, route, recvName) {
  var counter, inBang, rewind, inRewind;

  // create counter
  counter = patcher.newdefault(0, 0, "counter", 1, beats);
  counter.hidden = true;

  // connect driver to route
  patcher.hiddenconnect(counter, 0, route, 0);

  // add inlets for counter bang and clear
  inBang = patcher.newdefault(0, 0, "inlet");
  inBang.hidden = true;
  inBang.comment("Bang to advance sequence 1 step.");
  patcher.hiddenconnect(inBang, 0, counter, 0);

  var inRecv = patcher.newdefault(0, 0, "r", recvName);
  inRecv.hidden = true;
  patcher.hiddenconnect(inRecv, 0, counter, 0);

  rewind = patcher.newdefault(0, 0, "message");
  rewind.set("set", 1);
  rewind.hidden = true;
  patcher.hiddenconnect(rewind, 0, counter, 0);

  // add inlets for counter bang and clear
  inRewind = patcher.newdefault(20, 0, "inlet");
  inRewind.hidden = true;
  inRewind.comment("Bang to reset to beginning of sequence.");
  patcher.hiddenconnect(inRewind, 0, rewind, 0);

  var inRecvR = patcher.newdefault(0, 0, "r", recvName + "-R");
  inRecvR.hidden = true;
  patcher.hiddenconnect(inRecvR, 0, rewind, 0);

  // create a counter
  //var track = patcher.newdefault(60, 0, "number");
  //patcher.hiddenconnect(counter, 0, track, 0);
  //patcher.hiddenconnect(rewind, 0, track, 0);
}

/**
 * Uses an external js file to save the matrix state
 * for later reload when the file is saved and loaded.
 */
function StateSaver(patcher) {
  var matrix = patcher.getnamed(MATRIX_NAME);
  var savejs = patcher.newdefault(20, 20, "js", "savematrix.js", MATRIX_NAME);
  savejs.hidden = true;
  patcher.hiddenconnect(matrix, 0, savejs, 0);
}
