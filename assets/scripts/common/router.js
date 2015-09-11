/**
 * Global router, enabling DOM-based routing.
 * It analyses the body classes and fire associated
 * controllers callbacks.
 */
ab.Router = function() {};

ab.Router.fire = function(func, funcname, args) {
  var fire, namespace = this.routes, _this = this;

  funcname = (funcname === undefined) ? 'init' : funcname;
  fire = func !== '';
  fire = fire && namespace[func];
  fire = fire && typeof namespace[func][funcname] === 'function';

  if (fire) {
    namespace[func][funcname](args);
  }
};

ab.Router.loadEvents = function() {
  var _this = this;

  // Fire common init JS
  ab.Router.fire('common');

  // Fire page-specific init JS, and then finalize JS
  $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
    ab.Router.fire(classnm);
    ab.Router.fire(classnm, 'finalize');
  });

  // Fire common finalize JS
  ab.Router.fire('common', 'finalize');
};

ab.Router.init = function(routes) {
  this.routes = routes;
};
