ab.Services.Api = {};

/**
 * Send request to the backend API through
 * this proxy, using a nonce security token
 * to discuss with the server.
 *
 * Usage:
 *   ab.Services.Api.sendRequest(
 *   	 'my_action_api',
 *   	 { s: 'searched' },
 *   	 function(data) {},
 *   	 { dataType: 'jsonp' }
 *   );
 *
 * Caution: It's not recommended to change default request parameters,
 *          because it takes care of the security token by its own.
 *
 * @param  {String}   action  The Back-End registred action
 * @param  {Object}   data    The GET parameters to send along with the request
 * @param  {Function} cb      The handler to call afterward
 * @param  {Object}   options The request object to extend from the default one
 * @return {null}             None
 */
ab.Services.Api.sendRequest = function (action, data, cb, options) {
  cb = cb && typeof cb === 'function' ? cb : ab.Utils.noop;
  options = options || {};
  data = data || {};

  if (action && action.length > 0) {
    options = this.extendParams(options);
    options.data = this.extendData(action, data);

    this.send(options, cb);
  }
};

ab.Services.Api.extendData = function (action, data) {
  return $.extend({
    action: action,
    token: ab.Conf.vars.nonceToken
  }, data);
};

ab.Services.Api.extendParams = function (options) {
  return $.extend({
    url: ab.Conf.vars.ajaxUrl,
    method: 'GET',
    dataType: "json",
    data: {}
  }, options);
};

ab.Services.Api.send = function (options, cb) {
  $.ajax(options).done(cb);
};
