var gulp = require('gulp');
var browserify = require('gulp-browserify');
var babelify = require('babelify');

// Basic usage
gulp.task('default', ['scripts', 'watch']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('scripts', function() {
  gulp.src('src/index.js')
      .pipe(browserify({
        exclude: 'webpage',
        insertGlobals : true,
        debug : !gulp.env.production,
        transform: babelify
      }))
      .pipe(gulp.dest('./dist'));
});
