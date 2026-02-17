const gulp = require('gulp'),
  inlineSource = require('gulp-inline-source'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat');
gulp.task('js', function () {
  return gulp
    .src('./src/api.js')
    .pipe(concat('scripts.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(gulp.dest('./src/dist'));
});
gulp.task('inline', function () {
  var options = {
    rootpath: require('path').resolve(__dirname, 'src'),
    compress: false,
    attribute: 'inline'
  };
  return gulp
    .src('./src/index.html')
    .pipe(inlineSource(options))
    .pipe(gulp.dest('./'));
});
gulp.task('watch', function () {
  gulp.watch(['src/dist/*', 'src/*'], gulp.series('build'));
});
gulp.task('build', gulp.series('js', 'inline'));
gulp.task('default', gulp.series('build'));
