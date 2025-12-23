const gulp = require('gulp');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const { inlineSource } = require('inline-source');
const through = require('through2');
const fs = require('fs');
const path = require('path');

gulp.task('js', function () {
  return gulp
    .src('./src/analytics.js')
    .pipe(concat('scripts.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(gulp.dest('./src/dist'));
});

gulp.task('inline', async function () {
  return gulp
    .src('./src/index.html')
    .pipe(
      through.obj(async function (file, enc, cb) {
        try {
          const html = file.contents.toString();
          const dir = path.dirname(file.path);
          const inlined = await inlineSource(html, {
            rootpath: dir,
            compress: true,
            svgAsImage: false,
          });
          file.contents = Buffer.from(inlined);
          cb(null, file);
        } catch (err) {
          cb(err);
        }
      })
    )
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch(['src/dist/*', 'src/*'], gulp.series('build'));
});

gulp.task('build', gulp.series('js', 'inline'));
gulp.task('default', gulp.series('build'));
