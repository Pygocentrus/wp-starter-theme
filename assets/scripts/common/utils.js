ab.Utils = function () {};

ab.Utils.noop = function () {};
ab.Utils.alwaysTrue = function () { return !!1; };
ab.Utils.alwaysFalse = function () { return !1; };

ab.Utils.variables = {
  viewportWidth: $(window).width(),
  viewportHeight: $(window).height(),
  currentUrl: window.location.origin + window.location.pathname
};

ab.Utils.getViewportWidth = function () {
  return ab.Utils.variables.viewportWidth;
};

ab.Utils.getViewportHeight = function () {
  return ab.Utils.variables.viewportHeight;
};

ab.Utils.getLanguage = function () {
  return $('html').attr('lang') || 'en_US';
};

ab.Utils.getLanguageCode = function () {
  return ab.Utils.getLanguage() === 'fr_FR' ? 'fr' : 'en';
};

ab.Utils.inArray = function (needle, stack) {
  return stack.filter(function(el) { return el === needle; }).length > 0;
};

ab.Utils.debounce = function (cb, delay) {
  var timer;

  return function() {
    var args = arguments,
        context = this;

    clearTimeout(timer);

    timer = setTimeout(function() {
      cb.apply(context, args);
    }, delay);
  }
};

ab.Utils.throttle = function (cb, delay) {
  var last, timer;

  return function () {
    var context = this,
        now = +new Date(),
        args = arguments;

    if (last && now < last + delay) {
      clearTimeout(timer);

      timer = setTimeout(function () {
        last = now;
        cb.apply(context, args);
      }, delay);
    } else {
      last = now;
      cb.apply(context, args);
    }
  };
};

ab.Utils.getTranslateProperties = function(el) {
  var transformMatrix = el.css("-webkit-transform") ||
      el.css("-moz-transform") ||
      el.css("-ms-transform")  ||
      el.css("-o-transform")   ||
      el.css("transform");

  var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(','),
      x = matrix[12] || matrix[4],
      y = matrix[13] || matrix[5];

  return {
    x: Math.ceil(x) || 0,
    y: Math.ceil(y) || 0
  };
};

ab.Utils.isMobile = function () {
  return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) !== null;
};

ab.Utils.isRetina = function () {
  return window.devicePixelRatio > 1;
};

ab.Utils.getResolution = function () {
  if (window.screen.width) {
    return window.screen.width + "x" + window.screen.height;
  } else {
    return "Unknown";
  }
};

ab.Utils.getOrientation = function () {
  return window.screen.orientation.type || "Unknown";
};

ab.Utils.getOs = function () {
  if (navigator.appVersion.indexOf("Win") != -1) return "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) return "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) return "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) return "Linux";
  return "Unknown OS";
};

ab.Utils.getBrowserLanguage = function () {
  return navigator.language || "";
};

ab.Utils.convertToInt = function (str) {
  return parseInt(str);
};

ab.Utils.removeTrailingPx = function (str) {
  return ab.Utils.convertToInt( (str + '').replace('px', '') );
};

ab.Utils.calculate = function (op, a, b) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '/': return a / b;
    case '%': return a % b;
    case '*': return a * b;
  }
  return 0;
};

ab.Utils.generateUniqueId = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

ab.Utils.getRemainingTime = function (currentSeconds) {
  var mins = ~~(currentSeconds / 60),
      secs = currentSeconds % 60;

  // Hours, minutes and seconds
  var hrs = ~~(currentSeconds / 3600),
      mins = ~~((currentSeconds % 3600) / 60),
      secs = currentSeconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var format = '';

  if (hrs > 0) {
    format += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  format += '' + Math.floor(mins) + ':' + (secs < 10 ? '0' : '');
  format += '' + Math.floor(secs);

  return format;
};

ab.Utils.isIE = function () {
  return navigator.userAgent.indexOf('MSIE') > -1;
};

ab.Utils.isChrome = function () {
  return navigator.userAgent.indexOf('Chrome') > -1;
};

ab.Utils.isFirefox = function () {
  return navigator.userAgent.indexOf('Firefox') > -1;
};

ab.Utils.getBrowserInfo = function () {
  var nAgt = navigator.userAgent,
      browserName,
      fullVersion,
      ix;

  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
  }
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  else if ((verOffset=nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
  }
  else if ((verOffset=nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
  }
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1)
    < (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset + 1);

    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }

  if ((ix = fullVersion.indexOf(";")) != -1) {
    fullVersion = fullVersion.substring(0, ix);
  }
  if ((ix = fullVersion.indexOf(" ")) != -1) {
    fullVersion = fullVersion.substring(0, ix);
  }

  majorVersion = parseInt('' + fullVersion,10);
  if (isNaN(majorVersion)) {
    fullVersion  = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion,10);
  }

  return {
    browser: browserName,
    version: fullVersion
  };
};
