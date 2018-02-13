autowatch = 1;
var seq = new Global("com.ts.seq");

/**
 * Counter based sequencer driver.
 * Allows an external bang to push through our steps.
 */ 
seq.CounterDriver = function(patcher, beats, route, recvName) {
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
