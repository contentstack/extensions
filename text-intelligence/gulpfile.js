var gulp = require('gulp'),
  inline = require('gulp-inline'),
  uglify = require('gulp-uglify'),
  env = require('babel-preset-env'),
  minifyCss = require('gulp-minify-css'),
  babel = require('gulp-babel');


gulp.task('build',() => {
  return gulp.src('./source/index.html')
    .pipe(inline({
      js: [babel({
        presets: ['env']
      }), uglify],
      css: [minifyCss],
      disabledTypes: ['svg', 'img']
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', gulp.series('build'))
