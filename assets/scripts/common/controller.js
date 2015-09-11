ab.Controller = {};

ab.Controller.common = {};

ab.Controller.common.init = function () {
  ab.Controller.behaviors = [];

  ab.Controller.fn.initResizeHandler();
  ab.Controller.fn.initHandlebarsHelpers();
  ab.Controller.fn.loadGoogleAnalytics();
};

ab.Controller.common.finalize = function () {
  ab.Controller.fn.runBehaviors();
};

ab.Controller.fn = {};

ab.Controller.fn.loadGoogleAnalytics = function () {
  var tracker = new ab.Services.Tracker();
};

ab.Controller.fn.initResizeHandler = function () {
  /*
   * Global viewport width & height on resize,
   * avoid reparsing the DOM each time the app
   * needs to know its dimensions
   */
  ab.Services.Resize.enqueueHandler({ fn: function resizedWindow () {
    ab.Utils.variables.viewportWidth = $(window).width();
    ab.Utils.variables.viewportHeight = $(window).height();
  }});

  ab.Services.Resize.watch();
};

ab.Controller.fn.initHandlebarsHelpers = function() {
  // Returns the translated string
  Handlebars.registerHelper('translate', function(str) {
    return ab.Utils.getLanguage() === 'en_US' ? str : ab.Translations[str];
  });

  // Returns the html escaped string
  Handlebars.registerHelper('cleanHtml', function(str) {
    return str.replace(/\<br(\s\/)?\>/g, ' ');
  });

  // Returns the string truncated with a specified size
  Handlebars.registerHelper('truncate', function(str, len) {
    if (str.length > len) {
      var new_str = str.substr(0, len + 1);

      while (new_str.length) {
        var ch = new_str.substr(-1);

        new_str = new_str.substr(0, -1);
        if (ch == ' ') {
          break;
        }
      }

      if (new_str == '') {
        new_str = str.substr(0, len);
      }

      return new Handlebars.SafeString(new_str + '...');
    }
    return str;
  });
};

/**
 * Enqueue a custom function to run
 * during the application's teardown,
 * from anywhere in the other controllers
 *
 * Usage:
 *
 *   ab.Controller.addBehavior(function(arg1, arg2) {
 *     console.log('Hello there 1!', arg1, arg2);
 *   }, 2, [2, 3]);
 *
 * @param  {Function}  fn    The callback to throw
 * @param  {Int}   weight    The callback weight, to be ordered DESC
 * @param  {Array}   args    Arguments to apply on function's calling
 * @return {NULL}            None
 */
ab.Controller.fn.addBehavior = function(fn, weight, args) {
  weight = weight || 0;
  args = args || [];

  ab.Controller.behaviors.push({ fn: fn, weight: weight, args: args });
};

/**
 * Launches all the behaviors according to their weight
 * @return {NULL} None
 */
ab.Controller.fn.runBehaviors = function() {
  var orderByWeight = R.compose(R.reverse, R.sortBy(R.prop('weight'))),
      fireBehavior = function(bv) { bv.fn.apply(this, bv.args); };

  R.forEach(fireBehavior, orderByWeight(ab.Controller.behaviors));
};

/**
 * Debug helper to vizualise the behaviors, ordered by weight
 * @return {Array} The behaviors
 */
ab.Controller.fn.getBehaviors = function() {
  var sortByWeight = R.compose(R.reverse, R.sortBy(R.prop('weight')));
  return sortByWeight(ab.Controller.behaviors);
};
