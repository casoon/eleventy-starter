require("dotenv").config();

const path = require('path');

const posts = require("./config/posts");
const filters = require("./config/filters");
const shortcodes = require("./config/shortcodes");
const transforms = require("./config/transforms");

const MinifyPlugin = require("./plugins/minifyPlugin");
const AbsoluteUrlPlugin = require("./plugins/absoluteUrlPlugin");

module.exports = function (eleventyConfig) {

    // Filters
    Object.keys(filters).forEach((name) => {
        eleventyConfig.addFilter(name, filters[name]);
    });

    // Shortcodes
    Object.keys(shortcodes).forEach((name) => {
        eleventyConfig.addFilter(name, shortcodes[name]);
    });

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    // Posts
    Object.keys(posts).forEach((name) => {
        eleventyConfig.addCollection(name, posts[name]);
    });

    // Plugins
    eleventyConfig.addPlugin(AbsoluteUrlPlugin, { base: require("./data/metadata.json").url });
    eleventyConfig.addPlugin(MinifyPlugin);

    // Layouts
    eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

    eleventyConfig.setServerPassthroughCopyBehavior("copy");
    eleventyConfig.addPassthroughCopy({"public":"/"});
    eleventyConfig.addPassthroughCopy({
        './node_modules/alpinejs/dist/cdn.js': './assets/js/alpine.js',
    })
    eleventyConfig.setDataDeepMerge(true);

    return {
        templateFormats: ["njk"],
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true

    };
    //
};
