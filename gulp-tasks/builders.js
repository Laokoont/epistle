/**
 * Created by nachasic on 02.08.2016.
 */
/* eslint no-sync: 0 */

"use strict";

const gulp = require("gulp"),
    es = require("event-stream"),
    data = require("gulp-data"),
    yml = require("js-yaml"),
    grename = require("gulp-rename"),
    newer = require("gulp-newer"),
    markdown = require("markdown-it"),
    compilers = require("../classes/compilers"),
    utils = require("../classes/utils"),
    DB = require("../classes/database"),
    config = require("../classes/load-config"),
    fs = require("fs");

const paths = {
        stories: "src/stories/",
        posts: "src/blog/",
        author: "src/authors/",
        templates: { story: "templates/story.pug" },
        dist: { story: (name) => `dist/stories/${name}/` },
        timestamp: (name) => `${config.timestampsPath}/${name}.ts`
    },
    collections = {
        stories: {},
        posts: {}
    },
    database = new DB(["posts", "stories"]);

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
    let currentPostPath = null;
    const parser = markdown();

    database.posts.load()
        .then( database.check )
        .then( (collection) =>
            gulp.src(`${paths.posts}**/*.yml`)
                .pipe(newer(paths.timestamp(collection.name)))
                .pipe(grename( (path) => {
                    currentPostPath = `${paths.posts}/${path.dirname}`;
                    console.log(currentPostPath);
                } ))
                .pipe(data((got) => {
                    const post = yml.load(String(got.contents)),
                        // TODO: Move markdown parsing to a separate extensible class
                        content = parser.render( fs.readFileSync(`${currentPostPath}/post.md`, config.encoding) ),
                        excerpt = utils.excerpt( utils.stripTags(content) );

                    Object.assign(post, {
                        excerpt,
                        content
                    });

                    collection.update({
                        title: post.title,
                        date: post.date
                    }, post, { upsert: true });
                }))
        )
        .catch( (err) => console.log(err) );
});

gulp.task("prep-stories", ["reg-stories"], function () {
    let currentStoryStub = "";
    const parser = markdown();

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
    database.posts.find({})
        .then( (collection) => {
            console.log(collection.collect);
        } );

});