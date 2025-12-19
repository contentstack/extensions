const gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  fs = require('fs'),
  path = require('path');

gulp.task('js', function () {
  return gulp
    .src('./src/analytics.js')
    .pipe(concat('scripts.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./src/dist'));
});

gulp.task('inline', async function () {
  const { inlineSource } = require('inline-source');
  const htmlFile = './src/index.html';
  const outputFile = './index.html';
  
  try {
    const html = await inlineSource(htmlFile, {
      compress: false,
      rootpath: path.resolve('./src')
    });
    fs.writeFileSync(outputFile, html);
  } catch (err) {
    console.error('Error inlining source:', err);
    throw err;
  }
});

gulp.task('watch', function () {
  gulp.watch(['src/dist/*', 'src/*'], gulp.series('build'));
});

gulp.task('build', gulp.series('js', 'inline'));
gulp.task('default', gulp.series('build'));
