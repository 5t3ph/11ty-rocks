---
title: "Modifying Permalinks"
description: "Examples of common ways to modify permalink structure."
date: 2021-02-15
---

> Often permalinks are changed via front matter, but you may wish to apply permalink changes in a [data directory file](/tips/data-directory-file/) so that the change will apply to all content within a directory at once.

## Remove Directory Prefix

As noted in the [data directory file tips](/tips/data-directory-file/), you may wish for content contained in a directory to actually appear to live off of root:

```md
permalink: "/{%raw%}{{ page.fileSlug }}{%endraw%}/"
```

> `page` is provided by 11ty and you can learn more about the [page variable in the official docs](https://www.11ty.dev/docs/data-eleventy-supplied/)

## Add Date

The following will keep the existing structure based on directory location (provided by `page.filePathStem`), but prepend it with the content's `date`:

```md
permalink: "/{%raw%}{{ page.date }}{%endraw%}/{%raw%}{{ page.filePathStem }}{%endraw%}/"
```

> Take a minute to learn about [date handling in 11ty](https://www.11ty.dev/docs/dates/)

## Create Permalink From Title

You may want to use your post title for creating the permalink instead of the default of the file path/filename.

Conveniently, front matter data is available to `permalink` so you can actually use _any_ front matter to modify the permalinks structure.

However - you need to use it alongside the `slug` filter to ensure it's URL-formatted.

```md
permalink: "/{%raw%}{{ title | slug }}{%endraw%}/"
```

> If you tend to use code formatting or perhaps emojis in your titles (like I do) you may want to [modify the `slug` filter](/eleventyjs/slugs-anchors/#slug-filter-extension).

## Excluding and Moving Content

Permalinks can also be used to [prevent content output](/tips/excluding-content-output/), or [change it's location](/tips/changing-content-output/).
