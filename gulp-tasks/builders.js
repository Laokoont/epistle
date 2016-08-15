/**
 * Created by alojkin on 02.08.2016.
 */
"use strict";

const gulp = require("gulp"),
    es = require("event-stream"),
    data = require("gulp-data"),
    yml = require("js-yaml"),
    grename = require("gulp-rename"),
    markdown = require("markdown-it"),
    compilers = require("../classes/compilers"),
    utils = require("../classes/utils");

const paths = {
        stories: "src/stories/",
        posts: "src/blog/",
        author: "src/authors/",
        templates: { story: "templates/story.pug" },
        dist: { story: (name) => `dist/stories/${name}/` }
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
            if (!collections.posts[currentPostStub].excerpt) {
                collections.posts[currentPostStub].excerpt = utils.excerpt(String(got.contents));
            }
        }));
});

gulp.task("prep-stories", ["reg-stories"], function () {
    var currentStoryStub = "",
        parser = markdown();

    return gulp.src(`${paths.stories}/**/*.md`)
        .pipe(grename( (path) => {
            currentStoryStub = path.dirname;
        } ))
        .pipe(data( (got) => {
            collections.stories[currentStoryStub].markup = parser.render(String(got.contents));
            if (!collections.stories[currentStoryStub].excerpt) {
                collections.stories[currentStoryStub].excerpt = utils.excerpt(String(got.contents));
            }
        } ));
});

// TODO: implement task for rendering sass
gulp.task("render: stories", ["prep-stories"], function () {
    const tasks = [],
        calendar = utils.getCalendarSorting(collections.stories);

    for (const [stub, story] of utils.entries(collections.stories)) {
        tasks.concat(compilers.singleStoryTasks(stub, story));
    }
    tasks.concat(compilers.storiesTasks(collections.stories));

    return es.merge(tasks);
});

gulp.task("render: posts", ["reg-posts"], function () {
    console.log("labudai");
});