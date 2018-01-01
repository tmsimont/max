autowatch = 1;
var v = 0;

function set(i) {
  v = i;
}

function save() {
  embedmessage("set", v);
  embedmessage("bang");
}

function bang() {
  outlet(0, v);
}

function loadbang() {
  if (jsarguments.length > 1 && jsarguments[1] == "loadbang") {
    if (v != 0) {
      bang();
    }
  }
}
