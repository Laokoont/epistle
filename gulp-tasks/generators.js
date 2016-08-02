/**
 * Tasks for generating story, posts and other source
 * files, boilerplates, polymer elements
 * and other stuff like that.
 * Created by nachasic on 02.08.2016.
 */
"use strict";

var gulp = require("gulp"),
    file = require("gulp-file"),
    replace = require("gulp-replace"),
    YAML = require("json2yaml"),
    CLI = require("../classes/CLI"),
    translit = require("translitit-cyrillic-russian-to-latin");

var paths = {
    seeds: {
        story: "./seeds/story/**/*",
        storyPug: "./seeds/storyPug/**/*",
        blogPost: "./seeds/post/**/*"
    },
    blogPost: (name) => `./src/blog/${name}`,
    story: (name) => `./src/stories/${name}`
};

// Task for generating a story
gulp.task("create: story", function () {
    return CLI.askFor.storyMeta()
        .then( (meta) => {
            var config = YAML.stringify(meta),
                directory = paths.story( translit(meta.title) ),
                seeds = meta.pug ? paths.seeds.storyPug : paths.seeds.story;

            file("config.yml", config)
                .pipe( gulp.dest(directory) );
            gulp.src(seeds)
                .pipe( replace(/\$\{title}/g, meta.title) )
                .pipe( gulp.dest(directory) );
        } );
});

// Task for generating a blog post
gulp.task("create: post", function () {
    return CLI.askFor.postMeta()
        .then( (meta) => {
            var config = YAML.stringify(meta),
                directory = paths.blogPost( translit(meta.title) ),
                seeds = paths.seeds.blogPost;

            file("config.yml", config)
                .pipe( gulp.dest(directory) );
            gulp.src(seeds)
                .pipe( gulp.dest(directory) );
        } );
});
