/**
 * The class provides all the functionality necessary to
 * interact with user via console and get the data from user
 * input for various tasks
 * Created by nachasic on 30.07.16.
 */

/* eslint object-curly-newline: ["error", { "minProperties": 1 }] */
"use strict";

var prompt = require("prompt");

var CLI = ( function () {
    var result = {};

    // UI is asking user to enter some data
    result.askFor = {

        postMeta: () => new Promise(function (resolve, reject) {
            var schema = {
                properties: {
                    title: {
                        description: "  * Enter a title to your blogpost",
                        required: true
                    },
                    category: {
                        description: "  Enter the category",
                        required: false,
                        "default": "flame"
                    },
                    tags: {
                        description: "  Enter tags separated by comma",
                        required: false,
                        "default": "",

                        before: (value) => value === "" ? [] : value.replace(/,\s/g, ",").split(",")
                    },
                    date: {
                        description: "   You can set the date for the blog post",
                        required: false,
                        "default": ( new Date() ).toString(),

                        before: (value) => ( new Date(value) ).toString()
                    }
                }
            };

            prompt.start();
            console.log("Creating new blogpost");
            prompt.get(schema, (err, res) => {
                if (err) {
                    prompt.stop();
                    reject(err);
                }
                prompt.stop();
                resolve(res);
            });
        }),

        // asking for meta information on new story
        storyMeta: () => new Promise(function (resolve, reject) {
            var schema = {
                properties: {
                    title: {
                        description: "  * Enter a title for your story",
                        required: true
                    },
                    excerpt: {
                        description: "  Enter the excerpt for your new story",
                        required: false,
                        "default": ""
                    },
                    author: {
                        description: "  * Enter the ID of your author",
                        required: true,
                        "default": "Anonymus"
                    },
                    category: {
                        description: "  Enter a category for your story",
                        required: false,
                        "default": "netlore"
                    },
                    pug: {
                        description: "  Do you want to enable PUG? (y/n)",
                        required: false,
                        "default": "n",

                        before: (value) => value === "y" || value === "Y" || (/yes/i).test(value)
                    },
                    tags: {
                        description: "  Enter tags separated by comma",
                        required: false,
                        "default": "",

                        before: (value) => value === "" ? [] : value.replace(/,\s/gi, ",").split(",")
                    },
                    date: {
                        description: "   You can set the date for the story",
                        required: false,
                        "default": ( new Date() ).toString(),

                        before: (value) => ( new Date(value) ).toString()
                    }
                }
            };

            prompt.start();
            console.log("Creating new story...");
            prompt.get(schema, (err, res) => {
                if (err) {
                    prompt.stop();
                    reject(err);
                }
                prompt.stop();
                resolve(res);
            });
        })
    };

    return result;
}() );

module.exports = CLI;