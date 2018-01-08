autowatch = 1;
outlets = 4;

var dbltab = 0;
var ignore = 0;
var controller = new Controller();
var suggester = new FileSuggester("samples");

function reset() {
  controller.reset();
}

function save() {
  if (controller.shouldSave()) {
    embedmessage("reload", controller.getSaved());
  }
}

function reload(saved) {
  controller.restore(saved);
}

function accept() {
  controller.acceptSuggested();
}

function anything() {
  var a = arrayfromargs(messagename,arguments);

  // incoming key
  if (messagename == "msg_int") {
    switch(a[0]) {
      case  25: // shift tab
        controller.prevSuggestion();
        break;
      case   9: // tab
        ignore = 1;
        // tab hits twice for some reason..
        if (dbltab == 0) {
          controller.nextSuggestion();
          dbltab = 1;
        } else {
          dbltab = 0;
        }
        break;
      case  13: // return
        ignore = 1;
        controller.acceptSuggested();
        break;
      case 127: // delete
        break;
      default:
        controller.bangToTextbox();
        break;
    }
  }

  // called when textbox changed event occurs
  if (messagename == "textchanged") {
    if (ignore > 0) {
      controller.resetInput();
      ignore--;
    }
    controller.bangToTextbox();
  }

  // receive the text from the textedit obj
  if (messagename == "text") {
    controller.getSuggestionForEnteredText(a);
  }
}

function Controller() {
  var self = this;
  var entered = "";
  var suggested = "";
  var accepted = false;

  function setSuggestionText(text) {
    outlet(2,["set", text]);
  }

  function setTextboxText(text) {
    outlet(0,["set", text]);
  }

  function wordFromInput(a) {
    if (a.length < 2) return "";
    return a[1];
  }

  this.reset = function() {
    ignore = 0;
    suggester.lookup("");
    entered = "";
    suggested = "";
    accepted = false;
    suggester.lookup("");
    setSuggestionText("");
    setTextboxText("");
  }

  this.nextSuggestion = function() {
    suggested = suggester.nextSuggestion();
    setSuggestionText(suggested);
  }

  this.prevSuggestion = function() {
    suggested = suggester.prevSuggestion();
    setSuggestionText(suggested);
  }

  this.acceptSuggested = function() {
    accepted = true;
    entered = suggested;
    setTextboxText(suggested);
    outlet(3, entered);
  }

  this.unselect = function() {
    accepted = false;
  }

  this.getSuggestionForEnteredText = function(a) {
    entered = wordFromInput(a);

    // lookup the input in the suggester
    suggester.lookup(entered);
    suggested = suggester.getSuggestion();

    if (suggester.hasSuggestions) {
      // outlet a message to set to suggested text
      setSuggestionText(suggested);
    }
  }

  this.bangToTextbox = function() {
    // outlet from this js obj into textedit, causing textedit to pass 
    // entered text back to this js obj
    outlet(0, "bang");
  }

  this.resetInput = function() {
    // reset text after tab entry
    setTextboxText(entered);
  }

  this.shouldSave = function() {
    return accepted;
  }

  this.getSaved = function() {
    return entered;
  }

  this.restore = function(saved) {
    entered = saved;
    suggested = entered;
    self.resetInput();
    accepted = true;
    setTextboxText(entered);
    outlet(3, entered);
  }

}


function FileSuggester(path) {
  var self = this;
  var list = new FileList(path).list;
  var pos = 0;

  this.hasSuggestions = false;
  this.suggestions = [];

  // build a lookup table
  var map = new Map(list);

  this.lookup = function(index) {
    self.suggestions = map.lookup(index);
    if (self.suggestions.length > 0) {
      self.hasSuggestions = true;
    }
  }

  this.getSuggestion = function() {
    if (pos >= self.suggestions.length) {
      pos = 0;
    }
    return self.suggestions[pos];
  }
  this.nextSuggestion = function() {
    pos++;
    return self.getSuggestion();
  }
  this.prevSuggestion = function() {
    pos--;
    return self.getSuggestion();
  }
}

function Map(list) {
  var map = {};
  for (var i = 0; i < list.length; ++i) {
    var string = "";
    for (var j = 0; j < list[i].length; ++j) {
      string = string + list[i][j];
      if (typeof(map[string]) == "undefined") {
        map[string] = new Array();
      }
      map[string].push(list[i]);
    }
  }
  map[""] = list;
  this.lookup = function(index) {
    if (typeof(map[index]) == "undefined") {
      return [];
    } else {
      return map[index];
    }
  }
}

function FileList(path) {
  var list = listFromFolder(path);

  function merge(a1, a2) {
    for (var i = 0; i < a2.length; ++i) {
      a1.push(a2[i]);
    }
  }

  function listFromFolder(p) {
    var files = new Array();
    var r = new Folder(p);
    while (!r.end) {
      if (r.filename.length > 0) {
        if (r.filetype == "fold") {
          merge(files, listFromFolder(r.pathname + "/" + r.filename));
        }
        else {
          files.push(r.filename);
        }
      }
      r.next();
    }
    r.close();
    return files;
  }

  this.list = list;
}
