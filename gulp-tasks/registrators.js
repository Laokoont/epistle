/**
 * Created by alojkin on 02.08.2016.
 */
"use strict";

var gulp = require("gulp"),
    data = require("gulp-data"),
    yml = require("js-yaml"),
    grename = require("gulp-rename"),
    md = require("markdown-it")();

var paths = {
        stories: "src/stories/",
        posts: "src/blog/",
        author: "src/authors/"
    },
    collections = {
        stories: {},
        posts: {}
    };

gulp.task("reg-stories", function () {
    var currentStoryStub = "";

    return gulp.src(`${paths.stories}**/*.yml`)
        .pipe(grename( (path) => {
            currentStoryStub = path.dirname;
        } ))
        .pipe(data( (got) => {
            collections.stories[currentStoryStub] = yml.load(String(got.contents));
        }));
});

gulp.task("reg-posts", function () {
    var currentPostStub = "";

    return gulp.src(`${paths.posts}**/*.yml`)
        .pipe(grename( (path) => {
            currentPostStub = path.dirname;
        } ))
        .pipe(data( (got) => {
            collections.posts[currentPostStub] = yml.load(String(got.contents));
        }));
});

gulp.task("conv-stories", ["reg-stories"], function () {
    var currentStoryStub = "";

    return gulp.src(`${paths.stories}/**/*.md`)
        .pipe(grename( (path) => {
            currentStoryStub = path.dirname;
        } ))
        .pipe(data( (got) => {
            collections.stories[currentStoryStub].markup = md.render(String(got.contents));
        } ));
});

gulp.task("render: stories", ["conv-stories"], function () {
    
});