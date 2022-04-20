const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const { PurgeCSS } = require('purgecss');
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Cloudinary images
    // Cloudinary
    const cloudinaryCloudName = "kerlaches";
    const hostname = "https://playful-crisp-33f7e0.netlify.app";
    const cloudinaryWidths = [ 320, 740, 960, 1200 ];
    const cloudinaryTransforms = "q_auto,dpr_2.0,f_auto,";

    eleventyConfig.addShortcode('cloudImg', (path, alt, width, height, loading, classes, sizes ) => {
        const fetchBase = `https://res.cloudinary.com/${cloudinaryCloudName}/image/fetch/`;
        let sizing = `w_${width},h_${ height ? height : 'auto' }`;
        if ( width && height ) {
            sizing += `,ar_${width}:${height}`
        }
        const src = `${fetchBase}${cloudinaryTransforms}${sizing}/${hostname}${path}`;
        const srcset = cloudinaryWidths.map(w => {
            return `${fetchBase}q_auto,f_auto,w_${w}/${hostname}${path} ${w}w`;
        }).join(', ');

        return `<img src="${src}" srcset="${srcset}" sizes="${sizes ? sizes : '100vw'}" alt="${alt ? alt : ''}" width="${width}" height="${height}"${ classes ? 'class="' + classes + '"' : ''} loading="${loading ? loading : 'eager'}">`;
    });
    // Disable automatic use of your .gitignore
    eleventyConfig.setUseGitIgnore(false);

    // To Support .yaml Extension in _data for Netlify CMS
    eleventyConfig.addDataExtension("yaml", (contents) =>
        yaml.safeLoad(contents)
    );

    // Copy Static Files to /_Site
    eleventyConfig
        .addPassthroughCopy({
            "./src/_includes/assets/img": "/assets/img",
            "./src/_includes/assets/media": "/assets/media",
            "./src/_includes/assets/icons": "/assets/icons"
        })

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

    eleventyConfig.addFilter("ariaExpander", (name) => {
        return `${name.replace(/\s+/g, '-').toLowerCase()}-exp`
    });
        /**
     * Remove any CSS not used on the page and inline the remaining CSS in the
     * <head>.
     *
     * @see {@link https://github.com/FullHuman/purgecss}
     */
    eleventyConfig.addTransform('purge-and-inline-css', async function(content) {
        if (!this.outputPath.endsWith('.html')) {
            return content;
        }

        const purgeCSSResults = await new PurgeCSS().purge({
            content: [{ raw: content }],
            css: ['_site/assets/css/kerlaches.css'],
            keyframes: true
        });

        return content.replace('<!-- INLINE CSS-->', '<style>' + purgeCSSResults[0].css + '</style>');
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