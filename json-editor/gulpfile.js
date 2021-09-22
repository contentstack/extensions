const gulp = require('gulp'),
  inline = require('gulp-inline'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat');

gulp.task('js', function () {
  return gulp.src('./src/js/extension.js').pipe(
    babel({
      presets: ['@babel/env'],
    })
  );
});

gulp.task('inline', function () {
  return gulp
    .src('./src/index.html')
    .pipe(
      inline({
        js: uglify,
      })
    )
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch(['src/dist/*', 'src/*'], gulp.series('build'));
});

gulp.task('build', gulp.series('js', 'inline'));
gulp.task('default', gulp.series('build'));
