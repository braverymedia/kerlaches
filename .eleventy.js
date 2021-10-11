const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");

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

    eleventyConfig.addFilter("phone", (number) => {
        const linkReady = number.replace(/[^\d]/g, '');

        return `<a href="tel:+1${linkReady}" class="phone-number" title="Call us">${number}</a>`;
    })

    eleventyConfig.addFilter("gmapLink", (address) => {
        const gmap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

        return gmap;

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

    eleventyConfig.setBrowserSyncConfig({
        ghostMode: {
            clicks: false,
            scroll: false
        }
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