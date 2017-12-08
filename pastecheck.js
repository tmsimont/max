/**
 * Simple bang to given VAR_NAME MaxObject after a delay.
 * This is basically a loadbang but it works after copy/paste, too.
 */
var VAR_NAME = jsarguments[1];
function delayed() {
  this.patcher.getnamed(VAR_NAME).bang();
}
var t = new Task(delayed, this);
t.repeat(1);
