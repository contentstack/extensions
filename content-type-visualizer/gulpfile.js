const gulp = require('gulp');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


gulp.task('lint-js', (done) => {
  try {
    execSync('npx eslint source/*.js', { stdio: 'inherit' });
    done();
  } catch (error) {
    done(error);
  }
});

gulp.task('lint-css', (done) => {
  try {
    execSync('npx stylelint source/*.css', { stdio: 'inherit' });
    done();
  } catch (error) {
    done(error);
  }
});

gulp.task('build-js', () => {
  return gulp.src('source/index.js')
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('build-css', () => {
  return gulp.src('source/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./'));
});

gulp.task('inline-html', (done) => {
  let html = fs.readFileSync('source/index.html', 'utf8');
  const css = fs.readFileSync('style.css', 'utf8');
  const js = fs.readFileSync('index.js', 'utf8');
  
  // Replace external CSS link with inline style tag
  html = html.replace(
    /<link rel="stylesheet" href="style\.css">/,
    `<style>${css}</style>`
  );
  
  // Replace external JS script with inline script tag
  html = html.replace(
    /<script src="index\.js"><\/script>/,
    `<script>${js}</script>`
  );
  
  fs.writeFileSync('index.html', html);
  done();
});

gulp.task('build', gulp.series('lint-js', 'lint-css', 'build-js', 'build-css', 'inline-html'));

gulp.task('watch', () => {
  gulp.watch('source/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build'));
