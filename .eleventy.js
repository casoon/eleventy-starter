require("dotenv").config();

const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso');

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

    const styles = [
        './src/assets/css/styles.css',
    ];

    eleventyConfig.addTemplateFormats('css');

    eleventyConfig.addExtension('css', {
        outputFileExtension: 'css',
        compile: async (content, path) => {
            if (!styles.includes(path)) {
                return;
            }

            return async () => {
                let output = await postcss([
                    postcssImport,
                    postcssMediaMinmax,
                    autoprefixer,
                    postcssCsso,
                ]).process(content, {
                    from: path,
                });

                return output.css;
            }
        }
    });

    eleventyConfig.addNunjucksAsyncFilter('css', (path, callback) => {
        fs.readFile(path, 'utf8', (error, content) => {
            postcss([
                postcssImport,
                postcssMediaMinmax,
                autoprefixer,
                postcssCsso,
            ]).process(content, {
                from: path,
            }).then((output) => {
                callback(null, output.css)
            });
        });
    });

    eleventyConfig.addTemplateFormats('js');

    eleventyConfig.addExtension('js', {
        outputFileExtension: 'js',
        compile: async (content, path) => {
            if (path !== './src/assets/js/index.js') {
                return;
            }

            return async () => {
                let output = await esbuild.build({
                    target: 'es2020',
                    entryPoints: [path],
                    minify: true,
                    bundle: true,
                    write: false,
                });

                return output.outputFiles[0].text;
            }
        }
    });

    eleventyConfig.addPlugin(AbsoluteUrlPlugin, { base: require("./data/metadata.json").url });

    // Layouts
    eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

    eleventyConfig.setServerPassthroughCopyBehavior("copy");
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
    };
    //
};
