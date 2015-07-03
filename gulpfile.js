var gulp = require('gulp');
var webserver = require('gulp-webserver');
var angularProtractor = require('gulp-angular-protractor');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var concatVendor = require('gulp-concat-vendor');
var streamSeries = require('stream-series');
var htmlReplace = require('gulp-html-replace');

var e2eContentServer;

gulp.task('protractor-start', ['test-unit'], function() {
    return e2eContentServer = gulp.src('./')
        .pipe(webserver());
});

gulp.task('protractor-stop', ['protractor'], function() {
    e2eContentServer.emit('kill');
});

gulp.task('protractor', ['protractor-start'], function() {
    return gulp.src(['./spec/e2e/tests/*.js'])
        .pipe(angularProtractor({
            'configFile': 'protractor.conf.js',
            'debug': true,
            'args': ['--baseUrl', 'http://localhost:8000/'],
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            e2eContentServer.emit('kill');
        });
});

gulp.task('test-unit', function(cb) {
    karma.start({
        'configFile': __dirname + '/karma.conf.js',
        'singleRun': true
    }, cb);
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

gulp.task('replace-script-tags', function() {
    gulp.src('app/index.html')
        .pipe(htmlReplace({
            'js': 'app_bundle.js'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('test-e2e', ['protractor-stop']);
gulp.task('release', ['default', 'test-e2e', 'bundle-js', 'replace-script-tags']);
gulp.task('default', ['lint', 'test-unit']);