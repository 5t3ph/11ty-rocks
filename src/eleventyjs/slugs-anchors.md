---
title: "11ty Slugs and Anchors"
description: "Extend the default `slug` filter and enable heading anchors."
date: 2020-11-23
updatedOn: 2021-03-27
---

## `slug` Filter Extension

The default `slug` filter uses [slugify](https://www.npmjs.com/package/slugify) under the hood, but sometimes the default behavior isn't quite enough if you are using special characters, including emoji.

We can override the filter to enable `strict` mode, enforce lowercasing, and _optionally_ add any other characters you encounter being problematic. In this case, I'm enforcing removing `"` because I have experienced issues without explicitly defining it.

**Usage**: {% raw %}`{{ title | slug }}`{% endraw %}

```js
// Import prior to `module.exports` within `.eleventy.js`
const slugify = require("slugify");

eleventyConfig.addFilter("slug", (str) => {
  return slugify(str, {
    lower: true,
    strict: true,
    remove: /["]/g,
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
