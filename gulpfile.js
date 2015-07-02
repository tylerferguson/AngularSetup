var gulp = require('gulp');
var webserver = require('gulp-webserver');
var angularProtractor = require('gulp-angular-protractor');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatVendor = require('gulp-concat-vendor');
var streamSeries = require('stream-series');

var stream;

gulp.task('webserver-start', function() {
    return stream = gulp.src('./')
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
            'args': ['--baseUrl', 'http://localhost:8000/'],
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

//Should be a way to do this with chaining streams rather than merging
gulp.task('bundle-js', function() {
    var vendor = gulp.src('bower_components/**/*.min.js')
        .pipe(concatVendor('vendor.js'));

    var src = gulp.src(['app/app.module.js', 'app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify());

    streamSeries(vendor, src)
       .pipe(concat('app_bundle.js'))
       .pipe(gulp.dest('./dist'));
});

gulp.task('test-e2e', ['webserver-stop']);
gulp.task('default', ['lint', 'test-unit']);