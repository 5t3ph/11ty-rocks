---
title: "Creating and Using Eleventy Collections"
description: "Collections allow you to group templates and then sort, filter, and perform other manipulations to customize the display of your template content and data."
date: 2021-11-11
templateEngineOverride: md, njk
---

## What Are Collections?

> Collections are groups of template\* content.

One template can belong to multiple collections. These collections allow you to sort, filter, and perform other manipulations to customize the display of your template data.

Learning all the ways to create collections provides you architectural freedom in creating your Eleventy site!

<small>\* In 11ty terms, a _template_ is any content file to be processed or rendered by 11ty. If you create a new Markdown file, you have created a new Markdown template, etc.</small>

## Creating Collections

Collections are most often created from tags, but can also be groups based on other features like file type or front matter data. They can even be created from local data.

### Collections From `tags`

The simplest way to create a collection is with tags, and there are four syntaxes available.

**Single tag**:

```twig
tags: cat
```

**Multi-word tag**:

```twig
tags: cat and dog
```

**Multiple tags, single line**:

```twig
tags: ['cat', 'dog']
```

**Multiple tags, multiple lines**:

```twig
tags:
- cat
- dog
```

#### Assigning tags to many templates

While the examples shown are intended to be placed in a single template's front matter, there is an alternate way.

You may create a [_directory data file_](/tips/data-directory-file) to assign tags to an entire directory of templates.

Given a directory called `posts`, create the file `posts.json` (the name must match the directory name) and add the following to assign your tags.

```js
// posts/posts.json

{
  "tags": "posts"
}
```

## Display Collection Data

Once you have several templates assigned to a collection - for example, blog posts - you may want to display some of the collection data.

This example works for both Nunjucks or Liquid templates and will output the name of each item in the `posts` collection:

```twig
{% raw %}<ul>
{% for post in collections.posts %}
  <li>{{ post.data.title }}</li>
{% endfor %}
</ul>{% endraw %}
```

Other data available to display from a collection includes the following, as described on the [11ty Docs page for Collections](https://www.11ty.dev/docs/collections/#collection-item-data-structure):

- `inputPath`: the full path to the source input file (including the path to the input directory)
- `fileSlug`: mapped from the input file name
- `outputPath`: the full path to the output file to be written for this content
- `url`: url used to link to this piece of content.
- `date`: the resolved JS Date Object
- `data`: all data for this piece of content
- `templateContent`: the rendered content of this template (excludes layout wrappers)

## More Ways to Create Collections With `addCollection`

Let's look at the options available for creating collections beyond tags. These will be created within our `.eleventy.js` config, and use the `addCollection` function. This function allows us to create either new or modified collections.

### Group Tags Together

To create a collection based on multiple tags, use the additional function of `getFilteredByTags`.

```js
eleventyConfig.addCollection("tagGroup", function (collectionApi) {
  return collectionApi.getFilteredByTags("post", "page");
});
```

You may also perform additional operations once you have this new collections array to further filter or sort the items.

### Glob By File Type

You can create a new collection by selecting all templates by file type using `getFilteredByGlob()`.

There are a few stipulations for these collections:

- the templates must be located in your "input" directory
  - exceptions are: `_includes`, and templates marked as `eleventyExcludeFromCollections`
- must be a template type supported by Eleventy (ex. `.css` wouldn't work)

```js
eleventyConfig.addCollection("onlyMarkdown", function (collectionApi) {
  return collectionApi.getFilteredByGlob("**/*.md");
});
```

### Collections From Template Front Matter Data

To create a collection based on front matter data, you can use a filter against all template content with `getAll()`. Then, you can access any front matter using `item.data.customKey` and return the filtered collection by just checking if that key exists. Or, you could extend this to check for a particular value.

This technique is useful for grouping similar content beyond tags.

```js
eleventyConfig.addCollection("specialCollection", function (collection) {
  return collection.getAll().filter((item) => item.data.customKey);
});
```

### Collections From Local Data

For accessing local data - as in, data returned from files within your `_data` directory - use the format `getAll()[0].data.[customKey]`.

```js
// Create collection from _data/customData.js

eleventyConfig.addCollection("customDataCollection", (collection) => {
  const allItems = collection.getAll()[0].data.customData;

  // Filter or use another method to select the items you want
  // for the collection
  return allItems.filter((item) => {
    // ...
  });
});
```

This is useful if you're not using pagination to generate template content. If you are using pagination, you can instead opt to [assign paginated content to a collection via `tags`](https://www.11ty.dev/docs/pagination/#add-all-pagination-pages-to-collections) within the pagination process.

## The `all` Collection

The special `all` collection is available by default for all template content, with no extra definition required. It is intended to allow you to access all of your site content, which is useful for things like sitemaps or RSS feeds.

To access all your template data, iterate over `collections.all`.

## Filtered vs. Unique Collections

Instead of creating unique collections, existing collections can be passed into filters. Here are some considerations to help you choose which method to use.

**Use filters**:

- to apply variance per template (ex. randomization)
- to apply a repeatable modification like sorting (vs. the overhead of unique collections)

**Use collections**:

- for consistent results per build throughout your site

## Exclude Content From Collections

Sometimes you will want to remove a template from being included in collections. This attribute removes the template content from the `all` collection and any other defined collection.

```md
---
eleventyExcludeFromCollections: true
---
```

## Summary of Collection Creation Methods

- **tags**: easily group content in multiple, flexible ways by template or directory
- **globbed file types**: succinctly group related template content regardless of file system organization
- **front matter data**: extend collection schema beyond tags by grouping content from your own custom meta
- **local data**: benefit from the collection construct without resorting to pagination
- **filtering collections**: mutate existing collections with repeatable operations, as well as allow randomization per template if desired
