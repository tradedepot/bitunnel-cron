    let gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint')

gulp.task('lint', function() {
    gulp.src('./**/*.js')
        .pipe(jshint())
});

gulp.task('default', () => {
    nodemon({
            script: 'index.js',
            ext: 'html js',
            ignore: [],
            // tasks: ['lint']
        })
        .on('restart', function() {
            console.log('restarted!')
        })
})
