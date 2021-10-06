const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const getImageSize = require("image-size");

let imgConfig = {
    "breakpoints": [ 375, 768, 1024, 1360, 1600, 1980 ],
    "resize": "fit"
}
module.exports = function (eleventyConfig) {
    // Disable automatic use of your .gitignore
    eleventyConfig.setUseGitIgnore(false);

    // To Support .yaml Extension in _data for Netlify CMS
    eleventyConfig.addDataExtension("yaml", (contents) =>
        yaml.safeLoad(contents)
    );

    // Copy Static Files to /_Site
    eleventyConfig
        .addPassthroughCopy({
            "./src/admin/config.yml": "./admin/config.yml"
        })
        .addPassthroughCopy({
            "./src/_includes/assets/media": "/assets/media"
        });

    eleventyConfig.addFilter("md", function (content = "") {
        return markdownIt({ html: true }).render(content);
    });

    eleventyConfig.addFilter("instaUsernameFromUrl", (url) => {
		if( url.indexOf("https://instagram.com/") > -1 ) {
			return "@" + url.replace("https://instagram.com/", "");
		}
		return url;
	});

    // Image shortcodes
    eleventyConfig.addNunjucksShortcode("img", (src, alt, w = null, h = null, breakpoints = null ) => {
        let imgSize = getImageSize(`https://contigoatx.netlify.app${src}`);
        let srcWidths = [];
        let srcset;
        if ( !w || !h ){
            w = imgSize.width;
            h = imgSize.height;
        }
        if (!breakpoints) {
            breakpoints = imgConfig.breakpoints;
        }
        for( const [key, value] of Object.entries(breakpoints) ) {
            let set = `${src}?nf_resize=${imgConfig.resize}&w=${value} ${value}w`;
            srcWidths.push(set);
        }
        srcset = srcWidths.join(', ');
        return `<img src="${src}?nf_resize=${imgConfig.resize}" alt="${alt}" width="${ w }" height="${ h }" srcset="${srcset}" />`;
    });

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