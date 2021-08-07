---
title: "Filters for Data Arrays in 11ty"
description: "Learn several ways to randomly pick or subset data, or limit the returned results from a data array."
date: 2020-11-24
---

> These filters can be used on Eleventy collections or any custom data that presents as an array.

## `randomItem` Filter

Return a randomly picked item from a given array.

**Usage**: {% raw %}`{{ for item in collections.all | randomItem }}`{% endraw %}

```js
eleventyConfig.addFilter("randomItem", (arr) => {
  arr.sort(() => {
    return 0.5 - Math.random();
  });
  return arr.slice(0, 1);
});
```

## `limit` Filter

Return a subset of array items limited to the passed number.

**Usage**: {% raw %}`{{ for item in collections.all | limit(3) }}`{% endraw %}

```js
eleventyConfig.addFilter("limit", function (arr, limit) {
  return arr.slice(0, limit);
});
```

## `randomLimit` Filter

Given a collection and a limit in addition to the current `page.url`, returns the requested number of items excluding the current one. This is useful for showing additional posts without the current one being repeated in the list.

**Usage**: {% raw %}`{{ for item in collections.all | randomLimit(3, page.url) }}`{% endraw %}

```js
eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
  // Filters out current page
  const pageArr = arr.filter((page) => page.url !== currPage);

  // Randomizes remaining items
  pageArr.sort(() => {
    return 0.5 - Math.random();
  });

  // Returns array items up to limit
  return pageArr.slice(0, limit);
});
```

## `pluck` Filter

The `pluck` filter is useful if you want to return a subset of an array based on some known attribute values, such as given an array of titles.

**Version 1: Check against a value array**:

{%- raw %}

```twig
{%- set pickedPosts %}
["Title A", "Title B"]
{%- endset -%}
{% for post in collections.all | pluck(pickedPosts, 'title') %}
```

{% endraw -%}

```js
eleventyConfig.addFilter("pluck", function (arr, selections, attr) {
  // Assumes this is receiving a collection, hence the `data`
  // If custom array such as from _data, update accordingly
  return arr.filter((item) => selections.includes(item.data[attr]));
});
```

**Version 2: Check against a single attribute**

{%- raw %}

```twig
// Useful for getting a subset based on a secondary data list
{% for category in categories %}
// Then pluck just items in that "category"
{% for post in collections.all | pluck(category, 'category') %}
```

{% endraw -%}

```js
eleventyConfig.addFilter("pluck", function (arr, value, attr) {
  return arr.filter((item) => item.data[attr] === value);
});
```
