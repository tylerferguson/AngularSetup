var gulp = require('gulp');
var webserver = require('gulp-webserver');
var angularProtractor = require('gulp-angular-protractor');
var karma = require('karma').server;
var jshint = require('gulp-jshint');

var stream;

gulp.task('webserver-start', function() {
    return stream = gulp.src('app')
        .pipe(webserver());
});

gulp.task('webserver-stop', ['protractor'], function() {
    stream.emit('kill');
});

gulp.task('protractor', ['webserver-start'], function() {
    return gulp.src(['./spec/e2e/tests/*.js'])
        .pipe(angularProtractor({
            'configFile': 'protractor.conf.js',
            'debug': true,
            'args': ['--baseUrl', 'http://localhost:8000'],
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            stream.emit('kill');
        });
});

gulp.task('test-unit', function() {
    karma.start({
        'configFile': __dirname + '/karma.conf.js',
        'singleRun': true
    })
});

gulp.task('lint', function() {
    gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test-e2e', ['webserver-stop']);
gulp.task('default', ['lint', 'test-unit']);