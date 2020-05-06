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


/** 
 * *****************************
 * ********** minizik **********
 * *****************************
 */ 

/* --- css --- */
gulp.task('clean-dist-css-minizik', function() {
    return del(['dist/css/minizik*', '!dist/css'], {force: true})
});
gulp.task('build-css-minizik', function () {
    return gulp.src(['src/build/minizik.scss'])
    .pipe(sass({ importer: globImporter() }).on('error', sass.logError))
    .pipe(autoprefixer())    
    .pipe(cleanCSS({compatibility: '*', format: 'beautify'}))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('min-css-minizik', function () {
    return gulp.src('dist/css/minizik.css')
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('copy-minizik-css', function () {
    return gulp.src([
        'dist/css/minizik*.css',
    ])
    .pipe(gulp.dest('/home/www/music.kristuff.fr/myzik/www/assets/css'));
});
gulp.task('copy-minikit-css-to-minizik', function () {
    return gulp.src([
            'dist/css/minikit*.css', 
            'dist/css/minikit*.min.css',
    ]) 
    .pipe(gulp.dest('/home/www/music.kristuff.fr/myzik/www/assets/css'))
});

/* --- js --- */
gulp.task('clean-dist-js-minizik', function() {
    return del(['dist/js/minizik*', '!dist/js'], {force: true})
});
gulp.task('merge-js-minizik-setup', function () {
    return gulp.src([
        '/home/www/music.kristuff.fr/myzik/app/view/js/core.js', 
        '/home/www/music.kristuff.fr/myzik/app/view/js/setup/*.js',
    ])
    .pipe(concat('minizik.setup.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('merge-js-minizik-core', function () {
    return gulp.src([
        '/home/www/music.kristuff.fr/myzik/app/view/js/core.js', 
        '/home/www/music.kristuff.fr/myzik/app/view/js/app/*.js',
        '/home/www/music.kristuff.fr/myzik/app/view/js/media/*.js',
    ])
    .pipe(concat('minizik.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('merge-js-minizik-config', function () {
    return gulp.src([
        '/home/www/music.kristuff.fr/myzik/app/view/js/core.js', 
        '/home/www/music.kristuff.fr/myzik/app/view/js/admin/*.js',
    ])
    .pipe(concat('minizik.config.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('min-js-minizik', function () {
    return gulp.src('dist/js/minizik*.js')
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
     .pipe(rename({extname: ".min.js"}))
     .pipe(gulp.dest('dist/js'));
});
gulp.task('copy-minizik-js', function () {
    return gulp.src([
        'dist/js/minizik*.js', 
    ])
    .pipe(gulp.dest('/home/www/music.kristuff.fr/myzik/www/assets/js'));
});
gulp.task('copy-minikit-js-to-minizik', function () {
     return  gulp.src([
            'dist/js/minikit.js', 
            'dist/js/minikit.min.js',
    ])
    .pipe(gulp.dest('/home/www/music.kristuff.fr/myzik/www/assets/js'))
});

// ------------------------------------
gulp.task('build-minizik', function(log) {
    runSequence(
        ['clean-dist-css-minizik', 'clean-dist-js-minizik'],
        ['build-css-minizik', 'merge-js-minizik-core', 'merge-js-minizik-setup', 'merge-js-minizik-config'],
        ['min-css-minizik', 'min-js-minizik'],
        ['copy-minizik-css', 'copy-minizik-js'],
        ['copy-minikit-css-to-minizik', 'copy-minikit-js-to-minizik'],
        log
    );
});

/** 
 * *****************************
 * ******** minitoring *********
 * *****************************
 */ 

/* --- css --- */
gulp.task('clean-dist-css-minitoring', function() {
    return del(['dist/css/minitoring*', '!dist/css'], {force: true})
});

gulp.task('build-css-minitoring', function () {
    return gulp.src(['src/build/minitoring.scss'])
    .pipe(sass({ importer: globImporter() }).on('error', sass.logError))
    .pipe(autoprefixer())    
    .pipe(cleanCSS({compatibility: '*', format: 'beautify'}))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('min-css-minitoring', function () {
    return gulp.src('dist/css/minitoring.css')
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('copy-minitoring-css', function () {
    return gulp.src([
        'dist/css/minitoring*.css',
    ])
    .pipe(gulp.dest('/home/www/minitoring.kristuff.fr/minitoring/public/assets/css'));
});
gulp.task('copy-minikit-css-to-minitoring', function () {
    return gulp.src([
            'dist/css/minikit*.css', 
            'dist/css/minikit*.min.css',
    ]) 
    .pipe(gulp.dest('/home/www/minitoring.kristuff.fr/minitoring/public/assets/css'))
});

/* --- js --- */
gulp.task('clean-dist-js-minitoring', function() {
    return del(['dist/js/minitoring*', '!dist/js'], {force: true})
});
gulp.task('merge-js-minitoring-setup', function () {
    return gulp.src([
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/core.js', 
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/setup/*.js',
    ])
    .pipe(concat('minitoring.setup.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('merge-js-minitoring-core', function () {
    return gulp.src([
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/core.js', 
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/app/*.js',
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/system/*.js',
    ])
    .pipe(concat('minitoring.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('merge-js-minitoring-config', function () {
    return gulp.src([
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/core.js', 
        '/home/www/minitoring.kristuff.fr/minitoring/app/assets/js/admin/*.js',
    ])
    .pipe(concat('minitoring.config.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('min-js-minitoring', function () {
    return gulp.src('dist/js/minitoring*.js')
    .pipe(uglify().on('error', function(e){
            console.log(e);
     }))
     .pipe(rename({extname: ".min.js"}))
     .pipe(gulp.dest('dist/js'));
});
gulp.task('copy-minitoring-js', function () {
    return gulp.src([
        'dist/js/minitoring*.js', 
    ])
    .pipe(gulp.dest('/home/www/minitoring.kristuff.fr/minitoring/public/assets/js'));
});
gulp.task('copy-minikit-js-to-minitoring', function () {
    return  gulp.src([
           'dist/js/minikit.js', 
           'dist/js/minikit.min.js',
   ])
   .pipe(gulp.dest('/home/www/minitoring.kristuff.fr/minitoring/public/assets/js'))
});

// ------------------------------------
gulp.task('build-minitoring', function(log) {
    runSequence(
        ['clean-dist-css-minitoring', 'clean-dist-js-minitoring'],
        ['build-css-minitoring', 'merge-js-minitoring-core', 'merge-js-minitoring-setup', 'merge-js-minitoring-config'],
        ['min-css-minitoring', 'min-js-minitoring'],
        ['copy-minitoring-css', 'copy-minitoring-js'],
        ['copy-minikit-css-to-minitoring', 'copy-minikit-js-to-minitoring'],
        log
    );
});