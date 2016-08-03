/**
 * Created by alojkin on 03.08.2016.
 */
/* eslint object-curly-newline: ["error", { "minProperties": 1 }] */

"use strict";

var gulp = require("gulp"),
    pug = require("gulp-pug"),
    grename = require("gulp-rename");

var compilers = ( function () {
    var compObj = {},
        paths = {
            statics: {
                story: (stub) => [
                    `src/stories/${stub}/**/*`,
                    `!src/stories/${stub}/styles/*`,
                    `!src/stories/${stub}/*.md`,
                    `!src/stories/${stub}/*.pug`,
                    `!src/stories/${stub}/*.yml`
                ],
                post: (stub) => `src/blog/${stub}/static/**/*`
            },
            templates: {
                story: "templates/story.pug",
                storyPug: (stub) => `src/stories/${stub}/story.pug`
            },
            dist: {
                story: (name) => `dist/stories/${name}/`
            }
        },

        compileStoryTask = (stub, story) => {
            var source = story.pug ? paths.templates.storyPug(stub) : paths.templates.story;

            return gulp.src(source)
                .pipe(pug({
                    locals: story
                }))
                .pipe(grename( (path) => {
                    console.log(stub);
                    path.basename = "index";
                } ))
                .pipe(gulp.dest(paths.dist.story(stub)));
        },

        copyStaticFilesTask = (dir, stub) =>
            gulp.src(dir)
                .pipe(grename( (path) => {
                    console.log(path.basename);
                } ))
                .pipe(gulp.dest(paths.dist.story(stub)));

    compObj.storyTasks = (stub, story) => [
        compileStoryTask(stub, story),
        copyStaticFilesTask(paths.statics.story(stub), stub)
    ];

    return compObj;
}() );

module.exports = compilers;