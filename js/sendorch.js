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
    sends.push({
      "send" : sendName,
      "count" : count,
      "remaining" : count
    });
    contents[sendName] = 1;
    ++i;
  }
}

function rewind() {
  current = 0;
  // rewind listeners
  for (var name in contents) {
    messnamed(name + "-R", bang);
  }
}

function bang() {
  var s = sends[current];
  if (s.remaining > 0) {
    messnamed(s.send, "bang");
    s.remaining--;
  } else {
    s.remaining = s.count;
    current++;
    if (current >= sends.length) current = 0;
    bang();
  }
}
