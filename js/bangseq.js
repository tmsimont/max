autowatch = 1;

var valmap = {};
var argsIn = [];
var args = {};
var jsthis = this;
var textedit;
var main_seq = false;

function makeSeq() {
  var a = arrayfromargs(messagename,arguments);
  make(a[1], a[2], a[3], a[4]);
}

function make(voices, beats, sendName, recvName) {
  argsIn = [
    "-r", recvName,
    "-s", sendName,
    "-v", voices,
    "-b", beats
  ];
  main_seq = new Sequencer(0, this.patcher, false);
}

//-------------------------------------------------------
// Begin indvidual sequencer instance code
//-------------------------------------------------------

// matrix name does not seem to have to be unique in multiple sequencers...
var MATRIX_NAME = "main-matrix";


/**
 * Sequencer "class"
 */ 
function Sequencer(idx, patcher, replace) {
  args = readArgs(argsIn);
  var voices =   require("-v", args);
  var beats =    require("-b", args);
  var sendName = require("-s", args);
  var recvName = require("-r", args);

  var x = 0, y = 0;
  var outputs;
  var driver;
  var visuals = new VisualControls(patcher, x, y + 20, voices, beats);
  var routing = new RoutingControls(patcher, x, y + 20, voices, beats);
  var saver = new StateSaver(patcher, replace);

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
  driver = new CounterDriver(patcher, beats, routing.route, recvName);

  textedit = patcher.newdefault(0, 0, "textedit", "@keymode", 1, "@wordwrap", 0);
  textedit.rect = [0, 0, 22 + 16 * beats, 20];
  textedit.border(1);
  textedit.rounded(0);
  textedit.set(argsIn);
  patcher.hiddenconnect(textedit, 0, jsthis.box, 0);

  patcher.bringtofront(visuals.matrix);
  patcher.locked = 1;

  this.remove = function() {
    for (var i = 0; i < voices; i++) {
      patcher.remove(outputs[i]);
    }
    patcher.remove(textedit);
    visuals.remove();
    routing.remove();
    saver.remove();
    driver.remove();
  }

  this.replace = function() {
    this.remove();
    main_seq = new Sequencer(0, patcher, true);
  }

  this.saver = saver;
}

function VisualControls(patcher, x, y, voices, beats) {
  var matrix, 
    pasteCheck,
    xlbls,
    ylbls;

  // create matrix and side xlbls
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

  ylbls = new Array(voices);
  for (var i = 0; i < voices; ++i) {
    ylbls[i] = patcher.newdefault(x, y + 16 * i, "comment");
    //ylbls[i].set(voices-i-1);
    ylbls[i].set(i);
  }

  xlbls = new Array(beats);
  for (var i = 0; i < beats; ++i) {
    xlbls[i] = patcher.newdefault(21 + x + 16 * i, y + 16 * voices, "comment");
    xlbls[i].set(i+1);
  }

  this.remove = function() {
    patcher.remove(matrix);
    patcher.remove(pasteCheck);
    for (var i = 0; i < voices; i++) {
      patcher.remove(ylbls[i]);
    }
    for (var i = 0; i < beats; i++) {
      patcher.remove(xlbls[i]);
    }
  }


  // publish elements
  this.matrix = matrix;
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

  this.remove = function() {
    patcher.remove(route);
    patcher.remove(router);
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

  this.remove = function() {
    patcher.remove(counter);
    patcher.remove(inBang);
    patcher.remove(inRecv);
    patcher.remove(rewind);
    patcher.remove(inRewind);
    patcher.remove(inRecvR);
  }
}

/**
 * Uses an external js file to save the matrix state
 * for later reload when the file is saved and loaded.
 */
function StateSaver(patcher, loadState) {
  var matrix, savejs;
  matrix = patcher.getnamed(MATRIX_NAME);
  savejs = patcher.newdefault(20, 20, "js", "savematrix.js", MATRIX_NAME);
  savejs.varname = "savejs";
  patcher.hiddenconnect(jsthis.box, 0, savejs, 0);
  savejs.hidden = true;
  patcher.hiddenconnect(matrix, 0, savejs, 0);
  patcher.hiddenconnect(savejs, 0, jsthis.box, 0);

  // this bangs the savematrix.js on load and on copy/paste to make sure 
  // the values are restored in this bangseq.js local valmap after paste
  var pasteCheck = patcher.newdefault(
      20,
      40,
      "js",
      "pastecheck.js",
      "savejs");
  pasteCheck.hidden = true;

  if (loadState) {
    for (var key in valmap) {
      outlet(0, ["loadToMap", key, valmap[key]]);
    }
  }


  this.remove = function() {
    patcher.remove(savejs);
    patcher.remove(pasteCheck);
  }
}

function text() {
  var a = arrayfromargs(messagename,arguments);
  // TODO: validate args first
  a.shift();
  argsIn = a;
  if (main_seq) {
    main_seq.replace();
  } else {
    // remove everything except this js object
    var obj = this.patcher.firstobject;
    do {
      if (obj.js != jsthis) {
        var temp = obj.nextobject;
        this.patcher.remove(obj);
        obj = temp;
      } else {
        obj = obj.nextobject;
      }
    } while (obj);
    // new sequencer from scratch, loading valmap
    main_seq = new Sequencer(0, this.patcher, true);
  }
}

function saveToMap() {
  var a = arrayfromargs(messagename,arguments);
  var row = a[1];
  var col = a[2];
  var val = a[3];
  valmap[hash(row,col)] = val;
}

function hash(row, col) {
  return row + "-" + col;
}

/**
 * Helper to parse args passed into textbox
 */
function readArgs(a) {
  var args = {};
  if (a.length > 2) {
    // args must be in -flag val format
    for (var i = 0; i < a.length; i+=2) {
      args[a[i]] = a[i+1];
    }
  }
  return args;
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
