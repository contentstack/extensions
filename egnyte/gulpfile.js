const gulp = require('gulp'),
  inline = require('gulp-inline'),
  minifyCss = require('gulp-clean-css');

gulp.task('inline', function () {
  return gulp
    .src('./source/index.html')
    .pipe(
      inline({
        css: [minifyCss]
      })
    )
    .pipe(gulp.dest('./'));
});
gulp.task('watch', function () {
  gulp.watch(['source/*'], gulp.series('build'));
});
gulp.task('build', gulp.series('inline'));
gulp.task('default', gulp.series('build'));
