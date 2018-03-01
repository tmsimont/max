autowatch = 1;
var seq = new Global("com.ts.seq");

/**
 * Uses an external js file to save the matrix state
 * for later reload when the file is saved and loaded.
 */
seq.saver = function(main_jsthis, loadState) {
  var patcher = main_jsthis.patcher;
  var matrix, savejs;
  matrix = patcher.getnamed(seq.MATRIX_NAME);
  savejs = patcher.newdefault(20, 20, "js", "savematrix.js", seq.MATRIX_NAME);
  savejs.varname = "savejs";
  patcher.hiddenconnect(main_jsthis, 0, savejs, 0);
  savejs.hidden = true;
  patcher.hiddenconnect(matrix, 0, savejs, 0);
  patcher.hiddenconnect(savejs, 0, main_jsthis, 0);

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
    for (var key in seq.valmap) {
      outlet(0, ["loadToMap", key, seq.valmap[key]]);
    }
  }


  this.remove = function() {
    patcher.remove(savejs);
    patcher.remove(pasteCheck);
  }
}

