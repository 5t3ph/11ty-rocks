const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");

const openInCodepen = require("@11tyrocks//eleventy-plugin-open-in-codepen");

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

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

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(new Date(dateObj), {
      zone: "UTC",
    }).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("excerpt", (post) => {
    const content = post.replace(/(<([^>]+)>)/gi, "");
    return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
  });

  eleventyConfig.addFilter("hasTag", (tags, tag) => {
    return tags.includes(tag);
  });

  eleventyConfig.addFilter("stripFilename", (file) => {
    return file.replace(/\.[^/.]+$/, "");
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection("orderedResources", function (collection) {
    return collection
      .getFilteredByTag("resources")
      .filter((p) => !p.data.tags.includes("links"))
      .sort((a, b) => {
        return a.data.order - b.data.order;
      });
  });

  eleventyConfig.addCollection("communityResources", function (collection) {
    return collection.getAll()[0].data.community.sort((a, b) => {
      return b["yyyy-mm-dd"].replace(/-/g, "") - a["yyyy-mm-dd"].replace(/-/g, "");
    });
  });

  eleventyConfig.addFilter("pluck", function (arr, attr, value) {
    return arr.filter((item) => item.data[attr] === value);
  });

  eleventyConfig.addCollection("orderedLinks", function (collection) {
    return collection.getFilteredByTag("links").sort((a, b) => {
      return a.data.order - b.data.order;
    });
  });

  eleventyConfig.addPlugin(emojiReadTime);
  eleventyConfig.addPlugin(socialImages);

  eleventyConfig.addShortcode("codeDemo", function (css, html) {
    if (!html.length) return "";

    if (!css) {
      return `
<div class="demo">
${html}
</div>`;
    }

    const hash = Math.floor(Math.random(100) * Math.floor(999));

    const cssRE = new RegExp(/(?<=\.)([\w|-]+)(?=\s|,)/, "gm");
    const cssCode = css.replace(cssRE, `$1-${hash}`);

    let htmlCode = html;
    css.match(cssRE).forEach((match) => {
      // prettier-ignore
      const htmlPattern = match.replace("-", "\\-");
      const htmlRE = new RegExp(`(${htmlPattern})(?=\\s|")`, "gm");
      htmlCode = htmlCode.replace(htmlRE, `${match}-${hash}`);
    });

    return `
<style>${cssCode}</style>
<div class="demo">
${htmlCode}
</div>`;
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

  eleventyConfig.setBrowserSyncConfig({
    open: true,
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
