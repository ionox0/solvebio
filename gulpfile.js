var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  flatten = require('gulp-flatten'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  del = require('del');


gulp.task('copy-index-html', function() {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('./dist'));
});
gulp.task('copy-vendor-scripts', function() {
  gulp.src('./bower_components/angular-route/angular-route.min.js')
    .pipe(gulp.dest('./dist/vendor'));
});


gulp.task('templates', function() {
  gulp.src('./app/**/*.html')
    .pipe(flatten())
    .pipe(gulp.dest('./dist/templates'));
});


gulp.task('styles', function() {
  return sass('app/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});


gulp.task('scripts', function() {
  return gulp.src('app/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('clean', function() {
  return del(['dist/']);
});


gulp.task('default', ['clean'], function() {
  gulp.start('copy-index-html', 'copy-vendor-scripts', 'templates', 'styles', 'scripts', 'images', 'watch');
});


gulp.task('watch', function() {

  // Watch html files
  gulp.watch('./app/**/*.html', ['copy-index-html', 'templates']),

  // Watch .scss files
  gulp.watch('./app/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('./app/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('./app/images/**/*', ['images']);

});