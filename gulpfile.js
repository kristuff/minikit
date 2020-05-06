var gulp            = require('gulp');
var uglify          = require('gulp-uglify');
var gulpIf          = require('gulp-if');
var cleanCSS        = require('gulp-clean-css');
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var merge           = require('merge-stream');
var globImporter    = require('sass-glob-importer');
var imagemin        = require('gulp-imagemin');
var autoprefixer    = require('gulp-autoprefixer');
var del             = require('del');
var runSequence     = require('run-sequence');


// -----------------
// -- global var ---
// -----------------
var compatibility = '*'; // Internet Explorer 10+ compatibility mode  ie8 ie9 ie8 ie7



/** 
 * ------------------------
 *    clean dist folder
 * -------------------------
 */ 

// Task to delete target dist/js content 
gulp.task('clean-dist-js', function() {
    return del(['dist/js/**', '!dist/js'], {force: true})
});

// Task to delete target dist/css content
gulp.task('clean-dist-css', function() {
    return del(['dist/css/**', '!dist/css'], {force: true})
});

// Task to delete target dist content
gulp.task('clean-dist', function() {
    return merge('clean-dist-js', 'clean-dist-css');
});

/** 
 * -------------------------------------
 *          build css
 * -------------------------------------
 */ 
gulp.task('build-css-templates', function () {

    var buildWithPrefixe = function (template) {
        return gulp.src(['src/build/' + template + '.scss'])
        .pipe(sass({ importer: globImporter() }).on('error', sass.logError))
        .pipe(autoprefixer())    
        .pipe(cleanCSS({compatibility: '*', format: 'beautify'}))
        .pipe(rename({prefix:'minikit.'}))
        .pipe(gulp.dest('dist/css'));
    };

    var buildWithNewName = function (template, newName) {
        return gulp.src(['src/build/' + template + '.scss'])
        .pipe(sass({ importer: globImporter() }).on('error', sass.logError))
        .pipe(autoprefixer())    
        .pipe(cleanCSS({compatibility: '*', format: 'beautify'}))
        .pipe(rename(newName))
        .pipe(gulp.dest('dist/css'));
    };

    return merge(
        buildWithNewName('full', 'minikit.css'),
        buildWithPrefixe('images'),
        buildWithPrefixe('controls'),
    );
});


/** 
 * -------------------------------------
 *            build js 
 * -------------------------------------
 */ 

gulp.task('merge-js-core', function () {
    return gulp.src([
        'src/header.js', 
        'src/core/js/core.js', 
        'src/core/js/event.js', 
        'src/core/js/autobind.js', 
        'src/core/js/format.js', 
        'src/core/js/ajax.js', 
        'src/core/js/browser.js', 
        'src/core/js/scroll.js',
        'src/core/js/scrollspy.js',
        'src/core/js/parallax.js',
        'src/core/js/smoothscroll.js',
    ])
    .pipe(concat('minikit.core.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('merge-js-full', function () {
    return gulp.src([
        'src/header.js', 
        'src/core/js/core.js', 
        'src/core/js/event.js', 
        'src/core/js/autobind.js', 
        'src/core/js/format.js', 
        'src/core/js/ajax.js', 
        'src/core/js/browser.js', 
        'src/core/js/scroll.js',
        'src/core/js/scrollspy.js',
        'src/core/js/parallax.js',
        'src/core/js/smoothscroll.js',
        'src/components/**/*.js', 
    ])
    .pipe(concat('minikit.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('merge-js-controls', function () {
    return gulp.src([
        'src/header.js', 
        'src/components/**/*.js'
    ])
    .pipe(concat('minikit.controls.js'))
    .pipe(gulp.dest('dist/js'));
});


/** 
 * -------------------------------------
 *        Minify js /css /images
 * -------------------------------------
 */ 
gulp.task('min-css', function () {
    return gulp.src('dist/css/*.css')
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('min-js', function () {
    return gulp.src('dist/js/*.js')
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
     .pipe(rename({extname: ".min.js"}))
     .pipe(gulp.dest('dist/js'));
});

/** 
 * -------------------------------------
 *          Global tasks
 * -------------------------------------
 */
gulp.task('build-all', function(err) {
    runSequence('clean-dist',
                ['build-css', 'build-js'],
                err);
});

gulp.task('build-js', function(log) {
    runSequence('clean-dist-js',
                ['merge-js-core', 'merge-js-controls', 'merge-js-full'],
                'min-js',
                log);
});

gulp.task('build-css', function(log) {
    runSequence('clean-dist-css',
                ['build-css-templates'],
                'min-css',
                log);
});


