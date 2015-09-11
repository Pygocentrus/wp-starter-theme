/**
 * Allows watching mouse movements to detect
 * whether it's static of moving. In both case,
 * a callback can be called, eventually when a condition
 * is asserted as true
 *
 * Usage:
 *   ab.Services.Mouse
 *     .whenInactive(function() {
 *        _this.overlay.toggleClass('cursor-hidden');
 *     }, _this.overlay, 1500)
 *     .otherwiseWhen(
 *       function conditionRespected() {
 *         return _this.overlay.hasClass('cursor-hidden');
 *       },
 *       function thenDoThisWhenMouseActive() {
 *         _this.overlay.toggleClass('cursor-hidden');
 *       }
 *     );
 *
 * @type {Object}
 */
ab.Services.Mouse = {
  stoppedState: false,
  otherwise: function() {},
  followers: [],
  timeout: 2000,
  el: {}
};

/**
 * Sets a callback when the mouse is inactive.
 *
 * @param  {Function} fn       The handler to call
 * @param  {Object}   el       The element on which we want to watch the state
 * @param  {Float}    timeout  The delay we want to wait to check if it moved
 * @param  {Array}    args     The parameters to send to the handler when firing
 * @return {Object}            It, the element, to chain it with `otherwiseWhen`
 */
ab.Services.Mouse.whenInactive = function (fn, el, timeout, args) {
  var lastTimeMouseMoved = '',
      _this = this;

  fn = typeof fn === 'function' ? fn : function() {};
  timeout = timeout || ab.Services.Mouse.timeout;
  args = args || [];

  this.stoppedState = false;

  el.on('mousemove', function (e) {
    lastTimeMouseMoved = new Date().getTime();

    _this.otherwise.call();

    var t = setTimeout(function () {
      var currentTime = new Date().getTime();

      if (currentTime - lastTimeMouseMoved > timeout && !_this.stoppedState) {
        fn.apply(this, args);
      }
    }, timeout);
  });

  return this;
};

/**
 * Set a handler when the mouse moves back and eventually
 * only if a condition is validated
 *
 * @param  {Function} condition  The condition to check before calling the handler
 * @param  {Function} fn         The handler itself
 * @param  {Array}    args       The arguments to apply when firing the handler
 * @return {Null}                None
 */
ab.Services.Mouse.otherwiseWhen = function (condition, fn, args) {
  args = args || {};
  fn = fn && typeof condition === 'function' ? fn : ab.Utils.noop;
  condition = condition && typeof condition === 'function'
    ? condition
    : ab.Utils.alwaysTrue;

  if (typeof condition == 'function' && typeof fn === 'function') {
    this.otherwise = function () {
      if (condition()) {
        fn.apply(args);
      }
    };
  }
};

ab.Services.Mouse.addContext = function(container, el, options, fn) {
  var coordinates = {};

  options = options || {};
  fn = typeof fn === 'function' ? fn : ab.Utils.noop;

  container.on('mousemove', function(e) {
    coordinates = {
      x: e.pageX,
      y: e.pageY
    };

    el
      .css('display', 'block')
      .css('position', 'absolute')
      .css('top', (ab.Utils.removeTrailingPx(e.offsetY) + options.offsetY) + 'px')
      .css('left', (ab.Utils.removeTrailingPx(e.offsetX) + options.offsetX) + 'px');
  });
};

ab.Services.Mouse.removeContext = function(container) {
  container.unbind('mousemove');
};

ab.Services.Mouse.unBindOn = function (el) {
  el.unbind('mousemove');
  this.stoppedState = true;
  this.otherwise = ab.Utils.alwaysTrue;
};
