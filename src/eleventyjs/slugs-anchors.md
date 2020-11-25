---
title: "11ty Slugs and Anchors"
description: "Extend the default `slug` filter and enable heading anchors."
---

## `slug` Filter Extension

The default `slug` filter is not quite comprehensive of a few select characters, such as backticks and parentheses, and also doesn't strip emoji. We can add a helper package and update the regex to remedy this.

**Usage**: {% raw %}`{{ title | slug }}`{% endraw %}

```js
// npm install --save-dev emoji-regex
// Import prior to `module.exports` within `.eleventy.js`
const emojiRegex = require("emoji-regex");

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
```

## Enable anchor links on content headings

Eleventy uses [markdown-it](https://www.npmjs.com/package/markdown-it) for Markdown parsing, and shows a few options for configuring it in [the 11ty docs](https://www.11ty.dev/docs/languages/markdown/).

There are several plugins you can add to extend markdown-it, but in this example we are adding anchor links to our content headings. We're also extending the idea from our `slug` update to update which characters are removed and replaced to create anchors.

```js
// npm install --save-dev markdown-it-anchor
// Import prior to `module.exports` within `.eleventy.js`
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

let markdownLibrary = markdownIt({
  html: true,
}).use(markdownItAnchor, {
  permalink: true,
  permalinkClass: "tdbc-anchor",
  permalinkSymbol: "#",
  permalinkSpace: false,
  permalinkBefore: true,
  level: [1, 2],
  slugify: (s) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[\s+~\/]/g, "-")
      .replace(/[().`,%·'"!?¿:@*]/g, ""),
});

// This is the part that tells 11ty to swap to our custom config
eleventyConfig.setLibrary("md", markdownLibrary);
```
