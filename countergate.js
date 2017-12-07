/**
 * js countergate.js c1 c2 c3 ...
 *
 * This is basically a combination of a set of counters
 * and a gate.
 *
 * For each > 1 counter value passed as an argument,
 * (c1 c2 c3...) we create an outlet.
 * As messages are received in the left inlet, we pass them through
 * in a gate-like fashion to the open outlet, which starts as 0.
 * As each message is received, we countdown the number c1 until 0, and then
 * open up the next outlet.
 */

inlets = 2;
outlets = jsarguments.length - 1;

// we need at least one counter
if (jsarguments.length < 2) {
  error("Need at least one argument");
}

// set up tracking variables
var current = 0; // current outlet
var buckets = new Array(jsarguments.length - 1); // countdowns

// initialize the state
reset();

/**
 * reset internal counters to original count
 */
function reset() {
  for (var i = 0; i < buckets.length; i++) {
    // TODO support special args?
    try {
      var argSize = parseInt(jsarguments[i+1]);
      if (argSize < 1) error("Positive numbers should be given");
      buckets[i] = argSize;
    } catch(err) {
      error("Invalid input on countergate");
    }
  }
}

/**
 * all input in left inlet is passed through
 * and the internal counters are tracked
 */
function anything() {
  if (inlet == 0) {
    outlet(current, messagename);
    if (--buckets[current] == 0) {
      current = (current + 1) % buckets.length;
      if (current == 0) {
        reset();
      }
    }
  }
}
setinletassist(0, function() {
  assist("Messages received here are passed through to the open gate oulet.");
});

/**
 * bang on right inlet resets counters
 */
function bang() {
  if (inlet == 1) {
    reset();
  } else {
    anything();
  }
}
setinletassist(1, function() {
  assist("Bang here to reset in the internal counters.");
});
