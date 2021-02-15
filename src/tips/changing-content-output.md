---
title: "Changing Content Output"
description: "Learn how to change content output's file type and/or location within the filesystem."
date: 2021-02-15
---

> The following techniques are applied via front matter. The **base file** that you are using to create the altered content can use any of Eleventy's templating languages, and use all the features that language provides. For example, you could use Nunjucks or Liquid and loop through a collection to create JSON output.

## Change Content's Output File Type

One of Eleventy's super powers that allows you to [exceed the traditional limits of static](/posts/going-beyond-static-with-eleventy/) is in using templating to create _any_ file type output.

This is often used to create [sitemaps](https://github.com/5t3ph/11ty-netlify-jumpstart/blob/main/src/_generate/sitemap.njk) and [RSS feeds](https://github.com/5t3ph/11ty-netlify-jumpstart/blob/main/src/_generate/feed.njk).

Changing the file type is done by simply appending the desired extension via the `permalink`:

```md
permalink: "/{%raw%}{{ page.fileSlug }}{%endraw%}.txt"
```

> Learn more [tips for constructing permalinks](/tips/permalinks/)

## Output Content Outside the Eleventy Filesystem

This is again done via `permalink`, and requires also setting `permalinkBypassOutputDir: true` which allows making our permalink relative to _the project root_ using `./`.

```md
permalink: ./functions/{%raw%}{{ page.fileSlug }}{%endraw%}.txt
permalinkBypassOutputDir: true
eleventyExcludeFromCollections: true
```

Notice we're also excluding it from all collections since we are intentionally creating it for purposes outside of our main site structure.

> This technique is used to create page data for use by my [social image plugin](https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-social-images)
