var gulp = require('gulp');
var angularProtractor = require('gulp-angular-protractor');

gulp.task('protractor', function() {
    gulp.src(['./spec/e2e/tests/*.js'])
        .pipe(angularProtractor({
            'configFile': 'protractor.conf.js',
            'debug': true
        }))
});

gulp.task('default', ['protractor']);