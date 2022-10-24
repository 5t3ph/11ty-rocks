const collections = require("./src/_11ty/collections");
const filters = require("./src/_11ty/filters");
const shortcodes = require("./src/_11ty/shortcodes");

const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const openInCodepen = require("@11tyrocks//eleventy-plugin-open-in-codepen");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc);
  eleventyConfig.addPlugin(emojiReadTime);
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(openInCodepen, {
    siteUrl: "11ty.Rocks",
    siteTitle: "11ty Rocks!",
    siteTag: "11tyrocks",
    buttonClass: "tdbc-button tdbc-button--secondary",
    buttonIconClass: "tdbc-button__icon",
  });

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");

  // Collections: /src/_11ty/collections.js
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });

  // Filters: /src/_11ty/filters.js
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Shortcodes: /src/config/shortcodes.js
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  const linkAfterHeader = markdownItAnchor.permalink.linkAfterHeader({
    class: "tdbc-anchor",
    symbol: "<span hidden>#</span>",
    style: "aria-labelledby",
  });

  const markdownItAnchorOptions = {
    level: [1, 2, 3],
    slugify: (str) =>
      slugify(str, {
        lower: true,
        strict: true,
        remove: /["]/g,
      }),
    tabIndex: false,
    permalink(slug, opts, state, idx) {
      state.tokens.splice(
        idx,
        0,
        Object.assign(new state.Token("div_open", "div", 1), {
          // Add class "header-wrapper [h1 or h2 or h3]"
          attrs: [["class", `heading-wrapper ${state.tokens[idx].tag}`]],
          block: true,
        })
      );

      state.tokens.splice(
        idx + 4,
        0,
        Object.assign(new state.Token("div_close", "div", -1), {
          block: true,
        })
      );

      linkAfterHeader(slug, opts, state, idx + 1);
    },
  };

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, markdownItAnchorOptions);
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
      layouts: "_layouts",
    },
  };
};
