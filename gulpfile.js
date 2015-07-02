var gulp = require('gulp');
var webserver = require('gulp-webserver');
var angularProtractor = require('gulp-angular-protractor');
var karma = require('karma').server;

var stream;

gulp.task('webserver:start', function() {
    return stream = gulp.src('app')
        .pipe(webserver());
});

gulp.task('webserver:stop', ['protractor'], function() {
    stream.emit('kill');
});

gulp.task('protractor', ['webserver:start'], function() {
    return gulp.src(['./spec/e2e/tests/*.js'])
        .pipe(angularProtractor({
            'configFile': 'protractor.conf.js',
            'debug': true,
            'args': ['--baseUrl', 'http://localhost:8000'],
            'autoStartStopServer': true
        }));
});

gulp.task('test:unit', function() {
    karma.start({
        'configFile': __dirname + '/karma.conf.js',
        'singleRun': true
    })
});

gulp.task('e2eTests', ['webserver:stop']);
gulp.task('default', ['e2eTests']);