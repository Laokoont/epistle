var gulp = require("gulp"),
    fs = require("fs"),
    path = require("path"),
    prompt = require("prompt"),
    paths = {
        seeds: {
            story: "seeds/story"
        }
    };


// Task for generating a story
gulp.task("story", function() {
    var date = new Date(),
        schema = {
            properties: {
                title: {
                    description: "Enter a title for your story",
                    required: true,
                    default: "Just another story"
                },
                author: {

                }
            }

        };

    prompt.start();

});