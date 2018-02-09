autowatch = 1;
var repl = new Global("com.ts.repl");

repl.args = new ArgumentHelper();
function ArgumentHelper() {
  /**
   * Parse args passed into textbox
   */
  this.readArgs = function(a) {
    var cmdname = a[1];
    var args = {};
    if (a.length > 2) {
      // args must be in -flag val format
      for (var i = 1; i < a.length; i+=2) {
        args[a[i]] = a[i+1];
      }
    }
    return args;
  }

  /**
   * Give me the arg in the args
   * map or a default value if not present
   */
  this.argOrDefault = function(arg, def, args) {
    if (typeof(args[arg]) == "undefined") {
      return def;
    }
    return args[arg];
  }

  /**
   * Give me the arg in the args
   * map or throw an error if not present
   */
  this.require = function(arg, args) {
    if (typeof(args[arg]) == "undefined") {
      throw arg + " is required";
    }
    return args[arg];
  }
}
