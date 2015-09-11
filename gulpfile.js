/* Custom configuration file */
var conf = require('./gulp-conf');

/* Gulp plugins */
var gulp         = require('gulp'),
    del          = require('del'),
    size         = require('gulp-filesize'),
    foreach      = require('gulp-foreach'),
    gulpSequence = require('gulp-sequence'),
    browserSync  = require('browser-sync'),
    sourcemaps   = require('gulp-sourcemaps'),
    gzip         = require('gulp-gzip'),
    rename       = require("gulp-rename"),
    rev          = require('gulp-rev'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    hbs          = require('gulp-handlebars'),
    wrap         = require('gulp-wrap'),
    declare      = require('gulp-declare'),
    sass         = require('gulp-sass'),
    cmq          = require('gulp-combine-media-queries'),
    minifyCSS    = require('gulp-minify-css'),
    cssBase64    = require('gulp-css-base64'),
    autoprefix   = require('gulp-autoprefixer'),
    es           = require('event-stream'),
    handlebars   = require('gulp-compile-handlebars'),
    imagemin     = require('gulp-imagemin'),
    imageminJR   = require('imagemin-jpeg-recompress'),
    pngquant     = require('imagemin-pngquant'),
    reload       = browserSync.reload;

/* Concatenates vendor & custom styles + sass compilation */
gulp.task('styles', function () {
  var sassSource = conf.paths.sass + '/main.scss',
      vendors = conf.styles.lib.files.map(function(fileName) { return conf.styles.lib.prefix + fileName; }),
      custom = conf.styles.custom.files.map(function(fileName) { return conf.styles.custom.prefix + fileName; }),
      cssFiles = vendors.concat(custom);

  cssFiles.push(sassSource);

  return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
      .pipe(sass({ indentedSyntax: false }))
      .pipe(autoprefix({ browsers: ['last 2 versions'] }))
      .pipe(cssBase64({ extensionsAllowed: ['.svg', '.png'] }))
      .pipe(concat('app.css'))
      .pipe(gulp.dest(conf.paths.sass))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.paths.sass))
    .pipe(reload({ stream: true }));
});

/* Javascript task - Vendors */
gulp.task('scripts-vendors', function() {
  var vendors = conf.scripts.lib.files.map(function(fileName) { return conf.scripts.lib.prefix + fileName; });

  return gulp.src(vendors)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(conf.paths.scripts));
});

/* Javascript task - Custom */
gulp.task('scripts-custom', function() {
  var custom = conf.scripts.custom.files.map(function(fileName) { return conf.paths.scripts + fileName; });

  return gulp.src(custom)
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(conf.paths.scripts))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.paths.scripts));
});

/* Dist styles minification */
gulp.task('build-styles', ['styles'], function () {
  return gulp.src(conf.paths.styles + '/app.css')
    .pipe(cmq())
    .pipe(minifyCSS({ keepSpecialComments: 0, advanced: false }))
    .pipe(rename('app.min.css'))
    .pipe(rev())
    .pipe(gzip())
    .pipe(gulp.dest(conf.paths.dist + '/styles'))
    .pipe(rev.manifest('dist/rev-manifest.json', { base: process.cwd() + '/dist', merge: true }))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Dist vendors scripts minification */
gulp.task('build-scripts-vendors', ['scripts-vendors'], function () {
  return gulp.src(conf.paths.scripts + '/vendors.js')
    .pipe(uglify())
    .pipe(rename('vendors.min.js'))
    .pipe(rev())
    .pipe(gzip())
    .pipe(gulp.dest(conf.paths.dist + '/scripts'))
    .pipe(rev.manifest('dist/rev-manifest.json', { base: process.cwd() + '/dist', merge: true }))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Dist cusrom scripts minification */
gulp.task('build-scripts-custom', ['scripts-custom'], function () {
  return gulp.src(conf.paths.scripts + '/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(rev())
    .pipe(gzip())
    .pipe(gulp.dest(conf.paths.dist + '/scripts'))
    .pipe(rev.manifest('dist/rev-manifest.json', { base: process.cwd() + '/dist', merge: true }))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Prod version of the inc/conf.php file */
gulp.task('build-conf-file', function() {
  var manifest = require('./' + conf.paths.dist + '/rev-manifest.json') || {};

  return gulp.src('compiled/conf.php.hbs')
    .pipe(handlebars({
      isDev: 'false',
      cssProd: (manifest['app.min.css'] || 'app.min.css'),
      jsCustomProd: (manifest['app.min.js'] || 'app.min.js'),
      jsVendorsProd: (manifest['vendors.min.js'] || 'vendors.min.js')
    }))
    .pipe(rename('conf.php'))
    .pipe(gulp.dest(conf.paths.dist));
});

/* Manage Handlebars templates' precompilation */
gulp.task('templates', function(){
  gulp.src(conf.paths.scripts + '/templates/*.hbs')
    .pipe(hbs())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'wt.Templates',
      noRedeclare: true,
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(conf.paths.scripts));
});

/* Dist image optimization */
gulp.task('images', function() {
  return gulp.src(conf.paths.images + '/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [
        pngquant(),
        imageminJR({
          loops: 4,
          min: 50,
          max: 95,
          quality: 'high'
        })
      ]
    }))
    .pipe(gulp.dest(conf.paths.dist + '/images'));
});

/* Deletes the build folder entirely. */
gulp.task('clean', del.bind(null, [conf.paths.dist]));

/*
  Live browserSync server, taking care of the
  styles and scripts changes automatically
 */
gulp.task('serve', ['templates', 'scripts-vendors', 'scripts-custom', 'styles'], function () {
  /* Start browsersync for socket live reload */
  browserSync({
    notify: false,
    proxy: conf.paths.proxy,
    files: [conf.paths.styles + 'style.css', conf.paths.scripts + 'script.js'],
  });

  /* Watch styles */
  gulp.watch([
    conf.paths.styles + '/**/*.scss',
    conf.paths.styles + '/**/*.css',
    '!' + conf.paths.styles + '/app.css'
  ], ['styles']);

  /* Watch scripts */
  gulp.watch([
    conf.paths.scripts + '/**/*.js',
    '!' + conf.paths.scripts + '/app.js',
    '!' + conf.paths.scripts + '/vendors.js',
    '!' + conf.paths.scripts + '/templates/'
  ], ['scripts-custom', reload]);

  /* Watch scripts */
  gulp.watch([
    conf.paths.scripts + '/templates/*.hbs'
  ], ['templates', 'scripts-custom', reload]);

  /* Watch html */
  gulp.watch(['*.php', 'views/**/*.twig']).on('change', reload);
});

/* Show build files' size */
gulp.task('stats', function() {
  return gulp.src([conf.paths.dist + '/**/*.{js,css,gz}'])
    .pipe(foreach(function(stream, file){
      return gulp.src(file.path)
        .pipe(size());
    }))
});

/* Simple css & js compile task */
gulp.task('default', ['styles', 'scripts-vendors', 'scripts-custom']);

/* Prod build task */
gulp.task('build', gulpSequence('clean', 'build-styles', 'build-scripts-vendors', 'build-scripts-custom', 'build-conf-file', 'images', 'stats'));
