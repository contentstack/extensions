const gulp = require('gulp'),
  inline = require('gulp-inline'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat');
gulp.task('js', function () {
  return gulp
    .src('./source/ooyala.js')
    .pipe(concat('scripts.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(gulp.dest('./source/dist'));
});
gulp.task('inline', function () {
  return gulp
    .src('./source/index.html')
    .pipe(
      inline({
        css: [minifyCss],
        js: uglify,
      })
    )
    .pipe(gulp.dest('./'));
});
gulp.task('watch', function () {
  gulp.watch(['source/dist/*', 'source/*'], gulp.series('build'));
});
gulp.task('build', gulp.series('js', 'inline'));
gulp.task('default', gulp.series('build'));
