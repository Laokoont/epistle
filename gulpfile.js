var gulp = require("gulp"),
    fs = require("fs"),
    path = require("path"),
    file = require("gulp-file"),
    YAML = require("json2yaml"),
    UI = require("./classes/UI"),
    paths = {
        seeds: {
            story: "seeds/story"
        },
        story: name => ( `./stories/${name}` )
    };


// Task for generating a story
gulp.task("story", function () {

    return UI.askFor.storyMeta()
        .then( meta => {
            var config = YAML.stringify(meta),
                directory = paths.story(meta.title);

            console.log(config);

            return file("config.yml", config)
                .pipe( gulp.dest(directory) )
        } );
});

gulp.task("perm", function () {
    return file("test.txt", "this is a test")
        .pipe(gulp.dest("./test"))
})