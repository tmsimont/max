autowatch = 1;
function bang() {
  var txtEdit = this.patcher.newdefault(0, 0, "textedit", "@keymode", 1, "@wordwrap", 0);
  txtEdit.border(1);
  txtEdit.rounded(0);
  this.patcher.hiddenconnect(txtEdit, 0, this.box, 0);
}

function text() {
  var a = arrayfromargs(messagename,arguments);
  post(a);
}
