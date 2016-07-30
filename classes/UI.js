/**
 * Created by nachasic on 30.07.16.
 */
var prompt = require("prompt");

var CLI = ( function () {
    // UI is asking user to enter some data
    this.askFor = {

        // asking for meta information on new story
        storyMeta: () => new Promise(function (resolve, reject) {
            var schema = {
                    properties: {
                        title: {
                            description: "  * Enter a title for your story",
                            required: true
                        },
                        author: {
                            description: "  * Enter the ID of your author",
                            required: true,
                            default: "Anonymus"
                        },
                        category: {
                            description: "  Enter a category for your story",
                            required: false,
                            default: "netlore"
                        },
                        pug: {
                            description: "  Do you want to enable PUG? (y/n)",
                            required: false,
                            default: "n",

                            before: value => ( value === "y" || value === "Y" || /yes/i.test(value) )
                        },
                        tags: {
                            description: "  Enter tags separated by comma",
                            required: false,
                            default: "",

                            before: value => ( value === "" ? [] : value.replace(/,\s/gi, ",").split(",") )
                        },
                        date: {
                            description: "   You can set the date for the story",
                            required: false,
                            default: ( new Date() ).toString(),

                            before: value => ( new Date(value) ).toString()
                        }
                    }

                };

            prompt.start();
            console.log("Creating new story...");
            prompt.get(schema, (err, result) => {
                if (err) {
                    prompt.stop();
                    reject(err);
                }
                prompt.stop();
                resolve(result);
            })
        })
    };

    return this;
}() );

module.exports = CLI;