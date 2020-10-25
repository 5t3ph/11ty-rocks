// TEMP
const emojiReadTime = require("../eleventy-plugin-emoji-readtime");

const emojiRegex = require("emoji-regex");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
<<<<<<< HEAD
const { DateTime } = require("luxon");
=======
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
>>>>>>> 3d6045d0d4d4366782a9e0a3a8b16c664b609e28

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "America/Chicago",
    }).toLocaleString(DateTime.DATE_MED);
  });
  
  eleventyConfig.addCollection("orderedResources", function (collection) {
    return collection.getFilteredByTag("resources").sort((a, b) => {
      return a.data.order - b.data.order;
    });
  });

  eleventyConfig.addPlugin(emojiReadTime);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
