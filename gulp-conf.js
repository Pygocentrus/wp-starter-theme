var conf = {
  paths: {
    proxy: 'awesome.dev',
    app: '',
    dist: 'dist',
    scripts: 'assets/scripts',
    styles: 'assets/styles',
    sass: 'assets/styles',
    images: 'assets/images',
    fonts: 'fonts'
  },
  styles: {
    lib: {
      prefix: 'bower_components/',
      files: []
    },
    custom: {
      files: []
    }
  },
  scripts: {
    lib: {
      prefix: 'bower_components/',
      files: [
        'jquery/dist/jquery.min.js',
        'jquery-mousewheel/jquery.mousewheel.min.js',
        'jquery-throttle-debounce/jquery.ba-throttle-debounce.min.js',
        'ramda/dist/ramda.min.js',
        'handlebars/handlebars.min.js',
        'picturefill/dist/picturefill.min.js',
        'gsap/src/minified/TweenMax.min.js',
        'gsap/src/minified/plugins/ScrollToPlugin.min.js'
      ]
    },
    custom: {
      files: [
        '/common/awesome.js',
        '/conf/conf.js',
        '/common/utils.js',
        '/common/services.js',
        '/common/modules.js',
        '/common/router.js',
        '/services/api.js',
        '/services/resize.js',
        '/services/tracker.js',
        '/services/scroll.js',
        '/services/mouse.js',
        '/services/keyboard.js',
        '/common/controller.js',
        '/controllers/home.js',
        '/conf/translations.js',
        '/templates.js',
        '/main.js'
      ]
    }
  }
};

module.exports = conf;
