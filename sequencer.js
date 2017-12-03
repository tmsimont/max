autowatch = 1;

var sequencers = 0;

function make(voices, beats) {
  var x = 0, y = 0;
  var p = this.patcher.newdefault(
      x,
      x + 20 * sequencers,
      "patcher",
      "seq-" + ++sequencers);
  var seq = new Sequencer(p.subpatcher(), voices, beats);
}

/**
 * Sequencer "class"
 */ 
function Sequencer(patcher, voices, beats) {
  var x = 0, y = 0;
  var outs;
  var driver;
  var visuals = new VisualControls(patcher, x, y + 20, voices, beats);
  var routing = new RoutingControls(patcher, x, y, voices, beats);

  // create outlets 
  outs = new Array(voices);
  for (var i = 0; i < voices; ++i) {
    outs[i] = patcher.newdefault(x + 20 * i, 170, "outlet");
    outs[i].hidden = true;
  }

  // link outs and buttons
  for (var i = 0; i < voices; ++i) {
    patcher.hiddenconnect(routing.router, i, visuals.buttons[i], 0);
    patcher.hiddenconnect(routing.router, i, outs[i], 0);
  }

  // connect matrix to router
  patcher.hiddenconnect(visuals.matrix, 0, routing.router, 0);

  // create driver
  // TODO: allow caller to specify which driver
  //driver = new MetroDriver(patcher, beats, routing.route);
  driver = new CounterDriver(patcher, beats, routing.route);

  patcher.bringtofront(visuals.matrix);
  patcher.locked = 1;
}

function VisualControls(patcher, x, y, voices, beats) {
  var matrix, 
    buttons;

  // create matrix and side buttons
  matrix = patcher.newdefault(x+20, y, "matrixctrl");
  matrix.rows(voices);
  matrix.columns(beats);
  matrix.scale(false);
  matrix.autosize(true);

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
 * Driver extension: Metro-based sequencer driver.
 * Allows sequencer to be driven by self-contained 
 * metro with quarter-note resolution and 
 * the global transport.
 *
 * Issues:
 *   * Seems to be an out of order issue (could be SeqMod)
 *   * Tricky if not impossible to "pause" or have this used as
 *     a subsequence to a larger "chain" of patterns
 *
 */ 
function MetroDriver(patcher, beats, route) {
  var metro,
    seqMod;

  // create metro
  metro = patcher.newdefault(x, y, "metro", "4n");
  metro.active(1);
  metro.hidden = true;
  
  // create seqMod
  seqMod = patcher.newdefault(x, 40, "SeqMod", beats);
  seqMod.hidden = true;

  // connect metro to seqMod
  patcher.hiddenconnect(metro, 0, seqMod, 0);

  // connect driver to route
  patcher.hiddenconnect(seqMod, 0, route, 0);
}


/**
 * Driver extension: counter based sequencer driver.
 * Allows an external bang to push through our steps.
 *
 * Issues:
 *  * How do we rewind?
 *  * Puts burden of metro/transport control on caller
 */ 
function CounterDriver(patcher, beats, route) {
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

  rewind = patcher.newdefault(0, 0, "message");
  rewind.set("set", 1);
  patcher.hiddenconnect(rewind, 0, counter, 0);

  // add inlets for counter bang and clear
  inRewind = patcher.newdefault(20, 0, "inlet");
  inRewind.hidden = true;
  inRewind.comment("Bang to reset to beginning of sequence.");
  patcher.hiddenconnect(inRewind, 0, rewind, 0);

  // create a counter
  var track = patcher.newdefault(60, 0, "number");
  patcher.hiddenconnect(counter, 0, track, 0);
  patcher.hiddenconnect(rewind, 0, track, 0);
}
