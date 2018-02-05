autowatch = 1;
var bangstaff = new Global("bangstaff");
bangstaff.view = bangstaff.view || {};

bangstaff.view.BeatDisplay = function (jsthis, patcher, idx) {
  var beatWidth = 60,
    offset = 30,
    measureHeight = 200;
  var x = beatWidth + idx * offset - 60;

  /**
   * Use nslider to get horizontal staff
   */
  var nslider = patcher.newdefault(x, 0, "nslider");
  nslider.rect = [x, 0, x + beatWidth, measureHeight];
  nslider.rounded = 0;
  nslider.bordercolor(255, 255, 255, 0);
  nslider.bgcolor(255, 255, 255, 0);
  nslider.clefs(0);
  nslider.mode(1);

  /**
   * Put a button under the beat to allow mouse
   * selection
   */
  var select = patcher.newdefault(x, 0, "button");
  select.rect = [x + 40, measureHeight, x + beatWidth, measureHeight + 10];

  /**
   * Use a message instance to route the select button
   * back to the js controller
   */
  var smess = patcher.newdefault(x, 0, "message");
  smess.set("selectBeat", idx);
  smess.hidden = 1;
  patcher.hiddenconnect(select, 0, smess, 0);
  patcher.hiddenconnect(smess, 0, jsthis.box, 0);

  /**
   * Show the clefs on the nslider.
   */
  this.showClefs = function() {
    nslider.clefs(1);
  }

  var line = false;
  line = patcher.newdefault(x, 0, "jsui", "@filename", "bangstaff.view.jsline.js");
  line.rect = [x + 45, 0, x + 46, measureHeight];
  line.border(0);
  line.hidden = 1;
  line.compile();

  this.select = function() {
    line.hidden = 0;
    line.compile();
  }

  this.unselect = function() {
    line.hidden = 1;
  }

  /**
   * Show an array of notes in the clef
   */
  this.showNotes = function(notes) {
    nslider.flush();
    nslider.chord(notes);
  }

  this.remove = function() {
    if (line) patcher.remove(line);
    patcher.remove(nslider);
    patcher.remove(select);
    patcher.remove(smess);
  }
}
