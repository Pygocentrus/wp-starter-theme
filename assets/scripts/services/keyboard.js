/**
 * Simple service to manage keyboard events.
 * It allows binding functions when a keyboard event
 * happens and detach it using its ID. It's also
 * possible to send contextual data to functions
 * when they're called.
 *
 * Events taking care of:
 * 	 - 37: Left
 * 	 - 38: Up
 * 	 - 39: Right
 * 	 - 40: Down
 * 	 - 32: Spacebar
 * 	 - 33: Pageup
 * 	 - 34: Pagedown
 * 	 - 27: Escape
 *
 * @see ab.Services.Keyboard.attachEvent
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */
ab.Services.Keyboard = {
  actions : { 27: [], 32: [], 33: [], 37: [], 38: [], 39: [], 40: [] }
};

/**
 * Attach a function to an event code,
 * and send back its unique ID to eventually detach it afterward
 *
 * Usage:
 *   // Set an escape key handler
 *   var handlerId = ab.Services.Keyboard.attachEvent(27, function(str, punc) {
 *   	 // Puts 'Hello World!'
 *   	 console.log('Hello ' + str + punc);
 *
 *     // Eventually unset the this handler if used once
 *     ab.Services.Keyboard.detachEvent(handlerId);
 *   }, { exclusive: true, delay: 500 }, ['World', '!']);
 *
 * Available options:
 *   - exclusive [bool] : If the event is exclusive, it locks the other
 *   											events during its calling, needs delay option
 *   - delay [Float]    : Delay in ms between each callback of the same event
 *   - session [String] : A batch of events' ID, to unbind all at once
 *   											at the end. For instance when binding events
 *   											temporarily [TODO]
 *
 * @param  {Int}      key      The keyboard keycode
 * @param  {Function} fn       The callback to apply
 * @param  {Object}   options  The event firing options
 * @param  {Array}    args     Arguments to apply when calling the callback
 * @return {String}            Handler's unique ID
 */
ab.Services.Keyboard.attachEvent = function (key, fn, options, args) {
  var _this = ab.Services.Keyboard,
      uniqueId = ab.Utils.generateUniqueId(),
      isLocked = false;

  options = $.extend({ exclusive: !1, delay: 0, session: null }, options);
  args = args || [];

  if (key && fn && typeof fn === 'function' && _this.actions[key]) {
    _this.actions[key].push({
      id: uniqueId,
      options: options,
      fn: fn,
      args: args
    });

    document.onkeydown = function (evt) {
      evt = evt || window.event;

      if (_this.actions[evt.keyCode]) {
        R.forEach(function(action) {
          if (!action.options.linkedToScroll || ab.Services.Scroll.isEnabled) {

            // If the event is exclusive, we avoid next ones
            // to fire until delay's ending
            if (action.options.exclusive && !isLocked) {
              isLocked = true;

              // We relieve the locked behavior
              setTimeout(function() {
                isLocked = false;
              }, action.options.delay);

              // Fire the event
              _this.fireEvent(action, evt);

            } else if (!isLocked) {
              // Fire the event
              _this.fireEvent(action, evt);
            }
          }
        }, _this.actions[evt.keyCode]);
      }
    };

    return uniqueId;
  }

  return null;
};

/**
 * Unbind an event previously attached to a keycode
 *
 * Usage:
 * 	 ab.Services.Keyboard.detachEvent(handlerId);
 *
 * @param  {String} id  The handler's ID given by `attachEvent`
 * @return {Null}       None
 */
ab.Services.Keyboard.detachEvent = function (id) {
  var _this = ab.Services.Keyboard;

  for (key in _this.actions) {
    _this.actions[key] = _this.actions[key].filter(function(element) {
      return element.id !== id;
    });
  }
};

ab.Services.Keyboard.isScrollDisabled = function (e) {
  return ab.Services.Scroll.isDisabled();
};

/**
 * Takes an event ID and delay all the other ones
 * of the same keycode with its delay, so as to
 * make it exclusive for a while
 *
 * @param  {Float}  delay      The delay of time between the event and its followers
 * @param  {String} currentId  The event's unique ID
 * @param  {Array}  elements   All the events handling the same keycode
 * @return {Array}             The event's following events wrapped in a delayed closure
 */
ab.Services.Keyboard.delayNextEvents = function (delay, currentId, elements) {
  var isCurrentOne = function(el) { return el !== currentId },
      wrapWithDelay = function(el) { return function () { setTimeout(el.cb, el.delay); } },
      callbacks = R.takeLastWhile(isCurrentOne, elements);

  return R.map(wrapWithDelay, callbacks);
};

/**
 * Fire an event with its contextual arguments
 * @param  {Function} cb  The handler to call
 * @return {Null}         None
 */
ab.Services.Keyboard.fireEvent = function (cb, evt) {
  // Cloning the original custom arguments
  var args = cb.args.slice();

  /*
   * Adding the event's data to the custom
   * parameters at the beggining of the list
   */
  args.unshift(evt);

  // Then applying the callback with those proper data
  cb.fn.apply(this, args);
};
