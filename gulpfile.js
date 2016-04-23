"use strict";

// <editor-fold desc="VARS and Server">

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache  = require('gulp-cache'),
    runSequence = require('run-sequence');

const express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

var server = express();
server.use(livereload({port: livereloadport}));
server.use(express.static('dist'));
server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'dist' });
});

const project_name = 'components-template';
const images_path = '../../Yandex.Disk.localized/work-files/' + project_name;

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.emit('end');
};

// </editor-fold>

// <editor-fold desc="Styles - 'sass' ">

    gulp.task('sass', function () {
        gulp.src(['app/assets/styles/fonts.sass', 'app/assets/styles/header.sass', 'app/assets/styles/main.sass'])
            .pipe(sass({
                includePaths: require('node-bourbon').includePaths
            })).on('error', log)
            .pipe(rename({suffix: '.min', prefix : ''}))
            .pipe(autoprefixer({browsers: ['> 5%', 'last 2 versions'], cascade: false}))
            .pipe(minifycss())
            .pipe(gulp.dest('dist/assets/styles'))
    });

// </editor-fold>

// <editor-fold desc="Jade - 'jade'">

gulp.task('jade', function() {
    var YOUR_LOCALS = {};
    return gulp.src(['app/*.jade'])
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        })).on('error', log)
        .pipe(gulp.dest('dist'))
});

// </editor-fold>

// <editor-fold desc="Scripts - 'js-libs', 'js-common'">

//gulp.task('js-libs', function() {
//    return gulp.src([
//        'app/libs/[name].js'
//    ])
//        .pipe(gulp.dest('dist'))
//});

gulp.task('js-common', function() {
    return gulp.src('app/assets/scripts/**/*.js')
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/scripts'))
});

// </editor-fold>

// <editor-fold desc="Images - 'images', 'get-images' ">

gulp.task('clear-cache', function () {
    return cache.clearAll();
});

gulp.task('get-images', function () {
    return gulp.src([images_path + '/*', images_path + '/*/**', !images_path + '/Новая папка'])
        .on('error', log)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/assets/images'))
});

gulp.task('images',  function() {
    return gulp.src('app/assets/images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/assets/images'))
});

// </editor-fold>

// <editor-fold desc="Fonts - 'fonts' " >
gulp.task('fonts', function() {
    return gulp.src([
        'app/assets/fonts/**/*'
    ])
        .pipe(gulp.dest('dist/assets/fonts'))
});
// </editor-fold>

gulp.task('clean', function () {
    return del.sync([
        'dist/assets/styles',
        'dist/assets/scripts',
        'dist/assets/templates',
        'dist/assets/images',
        'dist/components'
    ])
});

gulp.task('watch', function(callback) {
    runSequence ('clean', ['images', 'fonts', 'sass', 'jade', 'js-common'], callback)
    server.listen(serverport);
    refresh.listen(livereloadport);

    gulp.watch('app/**/*.+(sass|scss)', ['sass']);
    gulp.watch('app/assets/scripts/**/*.js', ['js-common']);
    gulp.watch('app/*.jade', ['jade']);
    gulp.watch('app/assets/templates/**/*.jade', ['jade']);
    gulp.watch([images_path + '/**/*'], ['get-images']);
    gulp.watch(['app/assets/images/*/**'], ['images']);
    gulp.watch('app/assets/fonts/*', ['fonts']);

    gulp.watch('dist/*.+(htm|html)', refresh.changed);
    gulp.watch('dist/assets/styles/*', refresh.changed);
    gulp.watch('dist/assets/scripts/**/*.js', refresh.changed);
    gulp.watch('dist/assets/images/*', refresh.changed);
    gulp.watch('dist/assets/fonts/*', refresh.changed);
    gulp.watch('dist/components/**/*', refresh.changed);
});


gulp.task('default', ['watch']);