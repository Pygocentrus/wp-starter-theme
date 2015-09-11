/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * ======================================================================== */

(function($) {

  var abRoutes = {
    'common': {
      init: ab.Controller.common.init,
      finalize: ab.Controller.common.finalize
    },
    'home': {
      init: ab.Controller.home.init,
      finalize: ab.Controller.home.finalize
    },
    'articles': {
      init: ab.Controller.posts.archive.init,
      finalize: ab.Controller.posts.archive.finalize
    }
  };

  // Init the routes
  ab.Router.init(abRoutes);

  // Load Events
  $(document).ready(ab.Router.loadEvents);

})(jQuery);
