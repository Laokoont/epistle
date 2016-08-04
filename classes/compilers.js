/**
 * Created by nachasic on 03.08.2016.
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
                storiesArchive: "templates/stories.pug",
                story: "templates/story.pug",
                storyPug: (stub) => `src/stories/${stub}/story.pug`
            },
            dist: {
                story: (name) => `dist/stories/${name}/`
            }
        },

        copyStaticFilesTask = (dir, stub) =>
            gulp.src(dir)
                .pipe(grename( (path) => {
                    console.log(path.basename);
                } ))
                .pipe(gulp.dest(paths.dist.story(stub))),

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

        generateStoriesArchive = (collection) =>
            gulp.src(paths.templates.storiesArchive)
                .pipe(pug({
                    locals: {
                        stories: collection
                    }
                }))
                .pipe(gulp.dest("dist")),

        compilePostTask = () =>
            gulp.src()
                .pipe(gulp.dist()),

        generatePostsArchive = () =>
            gulp.src()
                .pipe(gulp.dist());

    compObj.singleStoryTasks = (stub, story) => [
        // TODO: implement styles rendering for PUG-enabled story
        compileStoryTask(stub, story),
        copyStaticFilesTask(paths.statics.story(stub), stub)
    ];

    compObj.storiesTasks = (collection) => [
        generateStoriesArchive(collection)
    ];

    return compObj;
}() );

module.exports = compilers;