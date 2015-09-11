/**
 * Simple helper to enqueue and dequeue handlers
 * on window resize event. It was made to centralize
 * and standardize the process in a single place.
 *
 * Usage:
 *   var id = ab.Services.Resize.enqueueHandler({ fn: function(a){}, args: ['a'] });
 *   ab.Services.Resize.dequeueHandler(id);
 *
 * To make it work, just make sure to call `ab.Services.Resize.watch`
 * once in your application, for instance at its runtime.
 * The enqueue function returns a unique ID that allow you to
 * switch the handler off if needed.
 *
 * @type {Object}
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */
ab.Services.Resize = {
  isResizing: false,
  handlers: []
};

ab.Services.Resize.watch = function () {
  this.bindEvents();
};

ab.Services.Resize.bindEvents = function () {
  $(window).bind('resize', { context: this }, $.debounce(200, this.onResize));
};

ab.Services.Resize.onResize = function (e) {
  var _this = e.data.context,
      fireHandler = function(handler) { handler.fn.apply(_this, handler.args); };

  R.forEach(fireHandler, _this.handlers);
};

ab.Services.Resize.enqueueHandler = function (options) {
  options = $.extend({ fn: ab.Utils.noop, args: [], id: ab.Utils.generateUniqueId() }, options);

  this.handlers.push(options);

  return options.id;
};

ab.Services.Resize.dequeueHandler = function (id) {
  var filteredHandler = function(handler) { return handler.id !== id; };

  this.handlers = R.filter(filteredHandler, this.handlers);
};
