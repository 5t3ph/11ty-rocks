---
title: "Excluding Content Output"
description: "Explore scenarios where you may want to exclude content from output or collections."
date: 2021-02-15
---

## Prevent Page Generation Output

Sometimes you may want to create content using your preferred templating language but not actually output an individual page.

The preferred way to do this is via permalink:

```md
permalink: false
```

If you want this to apply to an entire collection, you can do this in a [directory data file](/tips/data-directory-file). This example is used for this very site to create the resource content on the home page:

```json
{
  "tags": "resources",
  "permalink": false
}
```

> Read more about [setting permalink to `false`](https://www.11ty.dev/docs/permalinks/#permalink-false) in the official docs

## Excluding Content From Collections

Within a directory intended to be content for a collection, you may have content, such as the index, that you do not want included in the collection itself.

For this, use:

```md
eleventyExcludeFromCollections: [value of tag for collection]
```

Or, if you are using [the `all` collection](https://www.11ty.dev/docs/collections/#the-special-all-collection) such as for creating an RSS feed, you may want to exclude some content from being added to that collection:

```md
eleventyExcludeFromCollections: all
```

And to _entirely_ exclude the content from _any_ collection, set to `true`:

```md
eleventyExcludeFromCollections: true
```
