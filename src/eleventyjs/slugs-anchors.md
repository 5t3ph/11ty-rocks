---
title: "11ty Anchors"
description: "Enable heading anchors."
date: 2020-11-23
updatedOn: 2021-03-24
---

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
