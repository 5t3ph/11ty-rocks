---
title: "11ty Filters for Tags"
description: "Filters for working with tags"
---

## `hasTag` Filter

Useful when using a layout for multiple collection types, such as to provide a different call to action or link.

**Usage** within a layout for a single page:

{% raw %}`{% if tags | hasTag('post') %}`{% endraw %}

```js
eleventyConfig.addFilter("hasTag", (tags, tag) => {
  return tags.includes(tag);
});
```

> Could be genericized to `hasItem` and used on _any_ array data type.
