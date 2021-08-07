---
title: "Filters for 11ty Content"
description: "Includes filters for creating an excerpt and other content enhancements."
date: 2020-11-24
updatedOn: 2021-03-24
---

## `markdown` Filter

Sometimes you want to convert a specific bit of content into Markdown. For example, if you have created content as JSON formatted custom data within `_data`. In that case, you maybe don't want to use pagination to create pages but instead to loop through it somewhere.

By tapping into the included `markdown-it` Markdown parser that is used by Eleventy, we can create a filter to use adhoc on content:

```js
// Add above your Eleventy config
const markdownIt = require("markdown-it");

// Add within your config module
const md = new markdownIt({
  html: true,
});

eleventyConfig.addFilter("markdown", (content) => {
  return md.render(content);
});
```

To use this filter, you'll also need to pass it through the Eleventy-included `safe` filter to render insted of escape the compiled HTML:

```twig
{% raw %}{{ data.content | markdown | safe }}{% endraw %}
```

> **Note**: Since the Markdown conversion will include elements like paragraphs, don't place the line including that content within a `<p>` or you will end up with extra paragraphs.

## `excerpt` Filter

This filter expects the full post content - _post-processing_ - which it will strip HTML tags from and then limit to approximately the first 200 characters. The function backtracks to the space prior to the 200th character to prevent splitting words.

**Usage**: {% raw %}`<p>{{ post.templateContent | excerpt }}</p>`{% endraw %}

```js
eleventyConfig.addFilter("excerpt", (post) => {
  const content = post.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
});
```

## `addNbsp` Filter

> This filter is already available to you are using the [Social Images plugin](https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-social-images)

This filter intakes a string, such as for a page title, and inserts a non-breaking space - `nbsp;` - between the last two words to prevent a single word dangling on the last line (called an "orphan" by typographers).

**Usage**: {% raw %}`{{ title | addNbsp }}`{% endraw %}

```js
eleventyConfig.addFilter("addNbsp", (str) => {
  if (!str) {
    return;
  }
  let title = str.replace(/((.*)\s(.*))$/g, "$2&nbsp;$3");
  title = title.replace(/"(.*)"/g, '\\"$1\\"');
  return title;
});
```

## `stripFilename` Filter

Useful if using a value such as `layout` - which returns the full filename - in an alternate scenario, such as for part of a class name as shown.

**Usage**: {% raw %}`<body class="layout--{{ layout | stripFilename }}">`{% endraw %}

```js
eleventyConfig.addFilter("stripFilename", (file) => {
  return file.replace(/\.[^/.]+$/, "");
});
```

> **Note**: If actually using with `layout`, and your layouts are chained, it will return the "last" layout in the chain. Ex: if the filter code lives in `base.njk` but the page content is `post.njk`, will return `post` when using this filter.
