/**
 * Tiny service to enable and disable scroll
 * on the entire page whenever needed.
 *
 * Usage:
 *   ab.Services.Scroll.disableScroll();
 *   ab.Services.Scroll.enableScroll();
 *
 * @type {Object}
 * @author Pierre Guilhou <pierre.guilhou@hetic.net>
 */
ab.Services.Scroll = {
  isScrollDisabled: false
};

ab.Services.Scroll.isDisabled = function (e) {
  return this.isScrollDisabled;
};

ab.Services.Scroll.isEnabled = function (e) {
  return !this.isScrollDisabled;
};

ab.Services.Scroll.toggleDisableState = function (e) {
  this.isScrollDisabled = !this.isScrollDisabled;
};

ab.Services.Scroll.preventDefault = function(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
};

ab.Services.Scroll.disableScroll = function () {
  $('body').css('overflow', 'hidden');
  this.toggleDisableState();
};

ab.Services.Scroll.enableScroll = function () {
  $('body').css('overflow', 'visible');
  this.toggleDisableState();
};

ab.Services.Scroll.getDirection = function(event) {
  return event.deltaY > 0 ? 'up' : 'down';
};
