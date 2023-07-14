const { src, dest, watch, parallel } = require('gulp'),
  browserSync = require('browser-sync').create(),
  scss = require('gulp-sass')(require('sass')),
  uglify = require('gulp-uglify-es').default,
  plumber = require('gulp-plumber'),
  pug = require('gulp-pug'),
  // Pathes
  SCRIPT_URL = './dist/scripts/*.js',
  CSS_URL = './scss/index.scss',
  PUG_URL = './src/*.pug';

const scripts = () => src(SCRIPT_URL).pipe(plumber()).pipe(uglify()).pipe(dest('dist/scripts')).pipe(browserSync.stream());

const styles = (prodMode = false) =>
  src(CSS_URL)
    .pipe(plumber())
    .pipe(scss({ outputStyle: prodMode ? 'compressed' : 'expanded' }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());

const pugTask = (prodMode = false) => src(PUG_URL).pipe(pug()).pipe(dest('dist/')).pipe(browserSync.stream());

const watcher = () => {
  watch(['./scss/**/*.scss'], styles);
  watch([SCRIPT_URL], scripts);
  watch(['./src/**/*.pug'], pugTask).on('change', browserSync.reload);
};

const startBrowserSync = () => {
  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
  });
};

exports.default = parallel(styles, scripts, pugTask, startBrowserSync, watcher);
exports.prod = parallel(() => styles(true));
