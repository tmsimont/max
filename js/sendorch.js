var current = 0;

var sends;
var contents = {};

/**
 * Receive the script from a textbox
 */
function text() {
  var a = arrayfromargs(messagename, arguments);
  sends = new Array();
  contents = {};
  for (var i = 1; i < a.length; ++i) {
    var sendName = a[i];
    var count = a[i + 1];
    for (var j = 0; j < count; j++) {
      sends.push(sendName);
    }
    contents[sendName] = 1;
    ++i;
  }
  post(sends);post();
}

function rewind() {
  current = 0;
  // rewind listeners
  for (var name in contents) {
    messnamed(name + "-R", bang);
  }
}

function bang() {
  messnamed(sends[current++], "bang");
  if (current >= sends.length) current = 0;
}
