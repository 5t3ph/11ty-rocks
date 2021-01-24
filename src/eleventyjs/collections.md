---
title: "Customizing 11ty Collections"
description: "Create randomized and other variations for your Eleventy collections."
date: 2020-11-24
---

## `randomizedPosts` Collection

Create a randomized version of a tag collection.

As opposed to the [random filters](/eleventyjs/data-arrays/), a collection will persist throughout your site, whereas filters used on multiple pages will produce randomized results per page.

```js
eleventyConfig.addCollection("randomizedPosts", function (collection) {
  return (
    collection
      // Change to the name of your tag
      .getFilteredByTag("post")
      .sort(() => {
        return 0.5 - Math.random();
      })
      // Optional limit, remove if unwanted
      .slice(0, 3)
  );
});
```

## Collections Based on Frontmatter

Useful for when you may not want to create the collections by duplicating tags and instead use a custom frontmatter key.

```js
eleventyConfig.addCollection("specialCollection", function (collection) {
  return collection.getAll().filter((post) => post.data.customKey);
});
```
