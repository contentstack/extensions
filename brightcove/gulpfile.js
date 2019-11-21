const gulp = require('gulp');
const inline = require('gulp-inline');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');
const babel = require('gulp-babel');

gulp.task('build', () => {
    return gulp.src('./src/index.html')
        .pipe(inline({
            js: [babel({
                presets: ['@babel/preset-env']
            }), uglify],
            css: [minifyCss],
            disabledTypes: ['svg', 'img']
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch('src/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build'));
