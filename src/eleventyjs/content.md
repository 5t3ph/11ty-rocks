---
title: "Filters for 11ty Content"
description: "Includes filters for creating an excerpt and other content enhancements."
---

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
