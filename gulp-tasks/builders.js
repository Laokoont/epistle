/**
 * Created by alojkin on 02.08.2016.
 */
"use strict";

var config = require("../classes/load-config"),
    gulp = require("gulp"),
    es = require("event-stream"),
    data = require("gulp-data"),
    yml = require("js-yaml"),
    grename = require("gulp-rename"),
    md = require("markdown-it"),
    compilers = require("../classes/compilers");

var paths = {
        stories: "src/stories/",
        posts: "src/blog/",
        author: "src/authors/",
        templates: { story: "templates/story.pug" },
        dist: { story: (name) => `dist/stories/${name}/` }
    },
    collections = {
        stories: {},
        posts: {}
    },
    entries = function *(obj) {
        for (const key of Object.keys(obj)) {
            yield [key, obj[key]];
        }
    },
    excerpt = (text) => `${text.split(" ").slice(0, config.excerptLength).join(" ")}...`;

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
            if (!collections.posts[currentPostStub].excerpt) {
                collections.postsp[currentPostStub].excerpt = excerpt(String(got.contents));
            }
        }));
});

gulp.task("prep-stories", ["reg-stories"], function () {
    var currentStoryStub = "";

    md = md();

    return gulp.src(`${paths.stories}/**/*.md`)
        .pipe(grename( (path) => {
            currentStoryStub = path.dirname;
        } ))
        .pipe(data( (got) => {
            collections.stories[currentStoryStub].markup = md.render(String(got.contents));
            if (!collections.stories[currentStoryStub].excerpt) {
                collections.stories[currentStoryStub].excerpt = excerpt(String(got.contents));
            }
        } ));
});

// TODO: implement task for rendering sass
gulp.task("render: stories", ["prep-stories"], function () {
    var tasks = [];

    for (const [stub, story] of entries(collections.stories)) {
        tasks.concat(compilers.singleStoryTasks(stub, story));
    }
    tasks.concat(compilers.storiesTasks(collections.stories));

    return es.merge(tasks);
});

gulp.task("render: posts", ["reg-posts"], function() {
    console.log("labudai");
});