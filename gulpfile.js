var gulp = require("gulp"),
    fs = require("fs"),
    path = require("path"),
    file = require("gulp-file"),
    replace = require("gulp-replace"),
    YAML = require("json2yaml"),
    CLI = require("./classes/UI"),
    translit = require("translitit-cyrillic-russian-to-latin"),
    paths = {
        seeds: {
            story: "./seeds/story/**/*",
            storyPug: "./seeds/storyPug/**/*"
        },
        story: name => ( `./stories/${name}` )
    };


// Task for generating a story
gulp.task("create:story", function () {
    return CLI.askFor.storyMeta()
        .then( meta => {
            var config = YAML.stringify(meta),
                directory = paths.story( translit(meta.title) ),
                seeds = meta.pug ? paths.seeds.storyPug : paths.seeds.story;

            console.log(config);

            file("config.yml", config)
                .pipe( gulp.dest(directory) );
            gulp.src(seeds)
                .pipe( replace(/\$\{title}/g, meta.title) )
                .pipe( gulp.dest(directory) );
        } );
});
