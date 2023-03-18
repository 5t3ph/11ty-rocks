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

To _entirely_ exclude the content from _any_ collection, set `eleventyExcludeFromCollections` to `true`:

```md
eleventyExcludeFromCollections: true
```
