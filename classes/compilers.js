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
            templates: {
                story: "templates/story.jade"
            },
            dist: {
                story: (name) => `dist/stories/${name}/`
            }
        },

        compileStoryPugTask = (stub, story) =>
            gulp.src(paths.templates.story)
                .pipe(pug({
                    locals: story
                }))
                .pipe(grename( (path) => {
                    path.basename = "index";
                } ))
                .pipe(gulp.dest(paths.dist.story(stub)));

    compObj.pushStoryTasks = (streams, stub, story) => {
        streams.push(
            compileStoryPugTask(stub, story)
        );
    };

    return compObj;
}() );

module.exports = compilers;