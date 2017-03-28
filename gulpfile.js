"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var htmlreplace = require('gulp-html-replace');
var ghPages = require('gulp-gh-pages');

gulp.task("style", function() {
    gulp.src("css/style.css")
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("../krosmaster-map-editor-build/krosmaster-map-editor/css"));
});

gulp.task("images", function() {
    return gulp.src("img/**/*.{jpg, png, gif}")
        .pipe(imagemin([
            imagemin.jpegtran({ progressive : true }),
            imagemin.optipng({ optimizationLevel : 3 })
        ]))
        .pipe(gulp.dest("../krosmaster-map-editor-build/krosmaster-map-editor/img"));
});

gulp.task("js", function() {
    gulp.src("js/*.js")
        .pipe(concat("script.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("../krosmaster-map-editor-build/krosmaster-map-editor/js"));
});

gulp.task("clean", function() {
    return del(['../krosmaster-map-editor-build/krosmaster-map-editor/*'], {force: true});
});

gulp.task("copy", function() {
    return gulp.src([
        "img/**",
        "*.html"
    ], {
        base: "."
    })
        .pipe(gulp.dest("../krosmaster-map-editor-build/krosmaster-map-editor"));
});

gulp.task('html_replace', function() {
    gulp.src('index.html')
        .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'js': 'js/script.min.js'
        }))
        .pipe(gulp.dest('../krosmaster-map-editor-build/krosmaster-map-editor/'));
});

gulp.task("build", function(fn) {
    run(
        "clean",
        "copy",
        "style",
        "images",
        "js",
        "html_replace",
        fn
    );
});