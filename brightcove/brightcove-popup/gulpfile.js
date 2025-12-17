const gulp = require('gulp')
const inlinesource = require('gulp-inline-source')
const replace = require('gulp-replace')
const fs = require('fs')
const path = require('path')

gulp.task('default', () => {
    return gulp.src('./build/*.html')
        // Add inline attribute to JS files (handles crossorigin attribute from Vite)
        .pipe(replace(/(src="[^"]+\.js")(\s+crossorigin)?(\s*>)/g, '$1$2 inline$3'))
        // Add inline attribute to CSS files (handles crossorigin attribute from Vite)
        // Pattern: rel="stylesheet" [crossorigin] href="..." [crossorigin] >
        .pipe(replace(/(rel="stylesheet")(\s+crossorigin)?(\s+href="[^"]+\.css")(\s+crossorigin)?(\s*>)/g, '$1$2$3$4 inline$5'))
        .pipe(inlinesource({
            compress: false,
            ignore: ['png'],
            rootpath: './build'
        }))
        // Manual JS inlining for module scripts (gulp-inline-source doesn't handle type="module")
        .pipe(replace(/<script[^>]*src="([^"]+\.js)"[^>]*inline[^>]*><\/script>/g, (match, srcPath) => {
            const fullPath = path.join('./build', srcPath);
            if (fs.existsSync(fullPath)) {
                const jsContent = fs.readFileSync(fullPath, 'utf8');
                return `<script type="module">${jsContent}</script>`;
            }
            return match;
        }))
        .pipe(gulp.dest('./build'))
});