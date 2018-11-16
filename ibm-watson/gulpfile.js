const gulp = require('gulp'),
    inline = require('gulp-inline'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');

gulp.task('js', function() {
    return gulp.src(['./src/js/json-to-table.js', './src/js/intelligence.js'])
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./src/dist'))
});

gulp.task('inline', function() {
    return gulp.src('./src/index.html')
        .pipe(inline({
            css: [minifyCss],
            js: uglify
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(['src/js/*','src/css/*','src/index.html'], gulp.series('build'));
});

gulp.task('build', gulp.series('js', 'inline'));

gulp.task('default', gulp.series('build'));