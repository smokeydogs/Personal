var glob = require('glob');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var config = require('./config.js');

var mochaConfig = {
    "asyncOnly": true,
    "bail": true,
    slow: config.timeout / 2,
    timeout: config.timeout * 2
};


// Create task for each suite file in specs
function createSuite(suite) {
    gulp.task(suite, function() {
        mochaConfig.bail = true;
        return gulp.src(suite, {
            read: false
        }).pipe(mocha(mochaConfig));
    });
}
glob.sync("specs/**/*.js").forEach(createSuite);
glob.sync("rest/**/*.js").forEach(createSuite);


gulp.task("ui_test", function() {
    return gulp.src([
        'specs/*/*.js'
    ], {
        read: false
    }).pipe(mocha(mochaConfig));
});

gulp.task("rest_test", function() {
    return gulp.src([
        'rest/*/*.js'
    ], {
        read: false
    }).pipe(mocha(mochaConfig));
});

gulp.task('default', function() {
    return gulp.src([
        'specs/*/*.js'
    ], {
        read: false
    }).pipe(mocha(mochaConfig));
});
