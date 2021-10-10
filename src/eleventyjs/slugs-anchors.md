---
title: "11ty Slugs and Anchors"
description: "Extend the default `slug` filter and enable accessible heading anchors."
date: 2020-11-23
updatedOn: 2021-10-09
---

## `slug` Filter Extension

The default `slug` filter uses [slugify](https://www.npmjs.com/package/slugify) under the hood, but sometimes the default behavior isn't quite enough if you are using special characters, including emoji.

We can override the filter to enable `strict` mode, enforce lowercasing, and _optionally_ add any other characters you encounter being problematic. In this case, I'm enforcing removing `"` because I have experienced issues without explicitly defining it.

**Usage**: {% raw %}`{{ title | slug }}`{% endraw %}

```js
// Import prior to `module.exports` within `.eleventy.js`
const slugify = require("slugify");

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
```

## Enable anchor links on content headings

Eleventy uses [markdown-it](https://www.npmjs.com/package/markdown-it) for Markdown parsing, and shows a few options for configuring it in [the 11ty docs](https://www.11ty.dev/docs/languages/markdown/).

There are several plugins you can add to extend markdown-it, but in this example we are adding anchor links to our content headings. We're also extending the idea from our `slug` update to update which characters are removed and replaced to create anchors.

> Kudos to [Nicolas Hoizey](https://github.com/nhoizey/nicolas-hoizey.com/blob/main/.eleventy.js#L102-L133) for the concise method of modifying the `markdown-it-anchor` behavior to add a wrapping div to assist in styling placement of the anchor symbol. And for [raising the issue](https://github.com/valeriangalliat/markdown-it-anchor/issues/82) to improve the base behavior of this plugin.

The `markdown-it-anchor` plugin added [three permalink output options](https://github.com/valeriangalliat/markdown-it-anchor/tree/master#permalinks) to assist with accessibility. This snippet uses the `linkInsideHeader` option with a custom `symbol` and `permalink` render function, which produces output like the following that also adds a wrapping `.heading-wrapper`. I've also selected the `aria-labelledby` option to prevent the extra text showing up in RSS feeds and search engine results.

```js
// npm install --save-dev markdown-it-anchor slugify
// Import prior to `module.exports` within `.eleventy.js`
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
// If not already added from previous tip
const slugify = require("slugify");

const linkAfterHeader = markdownItAnchor.permalink.linkAfterHeader({
  class: "anchor",
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
  permalink(slug, opts, state, idx) {
    state.tokens.splice(
      idx,
      0,
      Object.assign(new state.Token("div_open", "div", 1), {
        attrs: [["class", "heading-wrapper"]],
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

// This is the part that tells 11ty to swap to our custom config
eleventyConfig.setLibrary("md", markdownLibrary);
```

**Example output**:

```html
<div class="heading-wrapper">
  <h2 id="enable-anchor-links-on-content-headings" tabindex="-1">Enable anchor links on content headings</h2>
  <a
    class="tdbc-anchor"
    href="#enable-anchor-links-on-content-headings"
    aria-labelledby="enable-anchor-links-on-content-headings"
  >
    <span hidden>#</span>
  </a>
</div>
```

Why use `hidden`? Because RSS, search engine results, and "reader mode" will (usually) respect it and prevent those environments from showing the anchor symbol.

You'll want the following CSS or similar to handle showing the anchor link symbol on your website:

```css
/* Make the '#' anchor visible on your site */
.anchor hidden {
  display: block;
}
```
