const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const Image = require("@11ty/eleventy-img");

// thanks @zachleat
async function imageShortcode(attrs = {}, options = {}) {
  options = Object.assign({},{
    widths: [null],
    formats: process.env.ELEVENTY_PRODUCTION ? ["avif", "webp", "jpeg"] : ["webp", "jpeg"],
    urlPath: "/_includes/assets/media/",
    outputDir: "./_site/assets/media/",
    sharpAvifOptions: {},
  }, options);

  let metadata = await Image(attrs.src || attrs.path, options);

  let imageAttributes = Object.assign({
    loading: "lazy",
    decoding: "async",
  }, attrs);

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
}

module.exports = function (eleventyConfig) {
    // Disable automatic use of your .gitignore
    eleventyConfig.setUseGitIgnore(false);

    // To Support .yaml Extension in _data for Netlify CMS
    eleventyConfig.addDataExtension("yaml", (contents) =>
        yaml.safeLoad(contents)
    );

    // Copy Static Files to /_Site
    eleventyConfig.addPassthroughCopy({
        "./src/admin/config.yml": "./admin/config.yml"
    });

    eleventyConfig.addFilter("md", function (content = "") {
        return markdownIt({ html: true }).render(content);
    });

    eleventyConfig.addFilter("twitterUsernameFromUrl", (url) => {
		if( url.indexOf("https://twitter.com/") > -1 ) {
			return "@" + url.replace("https://twitter.com/", "");
		}
		return url;
	});

    // Image shortcodes
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addLiquidShortcode("image", imageShortcode);
    eleventyConfig.addJavaScriptFunction("image", imageShortcode);

    // Minify HTML
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }

        return content;
    });

    // Let Eleventy transform HTML files as nunjucks
    // So that we can use .html instead of .njk
    return {
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid",
            "yml"
        ],
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
}