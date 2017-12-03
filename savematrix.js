autowatch = 1;

var valmap = {};

var MATRIX_NAME = jsarguments[1];

function saveToMap(row, col, val) {
  valmap[hash(row,col)] = val;
}

function hash(row, col) {
  return row + "-" + col;
}

function unhash(idx) {
  var splits = idx.split("-", 2);
  return {
    "row" : splits[0],
    "col" : splits[1]
  };
}

/**
 * Callback for the on-reload embedded messages.
 * This will get the named matrix object and 
 * inject the values that were saved, and then
 * update the valmap.
 */
function restore(values) {
  var msg = arrayfromargs(messagename, arguments);
  var row = parseInt(msg[1]);
  var col = parseInt(msg[2]);
  var val = parseInt(msg[3]);
  this.patcher.getnamed(MATRIX_NAME).message([
      row,
      col,
      val
  ]); 
  saveToMap(row, col, val);
}

/**
 * Message received when user enters a value into
 * the matrix. Save the value to the js valmap
 * and mark the patcher as dirty.
 */
function list() {
  var msg = arrayfromargs(messagename, arguments);
  var row = msg[0];
  var col = msg[1];
  var val = msg[2];
  saveToMap(row, col, val);
  this.patcher.wind.dirty = 1;
}

/**
 * During save, for each value in the matrix we will have
 * an embed message registered to restore an individual
 * row/column/value set.
 */
function save() {
  for (var hidx in valmap) {
    var idx = unhash(hidx);
    if (idx.row && idx.col) {
      embedmessage("restore", [idx.row, idx.col, valmap[hidx]]);
    }
  }
}
