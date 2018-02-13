autowatch = 1;
var seq = new Global("com.ts.seq");

seq.VisualControls = function(patcher, x, y, voices, beats) {
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
  matrix.varname = seq.MATRIX_NAME;

  // this bangs the matrix on load and on copy/paste to make sure 
  // the values restored in the StateSaver are applied to the 
  // connected routing elements
  pasteCheck = patcher.newdefault(
      20,
      20,
      "js",
      "pastecheck.js",
      seq.MATRIX_NAME);
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


