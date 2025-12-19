const gulp = require('gulp'),
  inlinesource = require('gulp-inline-source'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat');
gulp.task('js', function () {
  return gulp
    .src('./src/optimizely-experiment.js')
    .pipe(concat('scripts.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./src/dist'));
});
gulp.task('css', function () {
  return gulp
    .src('./src/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./src/dist'));
});
gulp.task('inline', function () {
  return gulp
    .src('./src/index.html')
    .pipe(inlinesource({
      compress: false,
      rootpath: './src'
    }))
    .pipe(gulp.dest('./'));
});
gulp.task('watch', function () {
  gulp.watch(['src/dist/*', 'src/*'], gulp.series('build'));
});
gulp.task('build', gulp.series('js', 'css', 'inline'));
gulp.task('default', gulp.series('build'));
