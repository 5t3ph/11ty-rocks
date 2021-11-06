---
title: "Directory Data File"
description: "Quickly assign settings to a collection instead of repeating the info in each content's front matter."
date: 2021-02-15
---

## Create a Directory Data File

To create a directory data file, add a `json` file within your directory with the same name as the directory.

For example, within `/posts/` create `posts.json`.

## Assign Tags and Layout

Most often, I use directory data files to quickly create collections via `tags` and also to assign all the directory content to a layout.

```json
{
  "tags": "posts",
  "layout": "post"
}
```

> If needed, you can still override these values within the front matter of individual files.

## Change Permalink Structure

Another very handy feature is the ability to change the `permalink` structure for all content within directory.

Here's one example of assigning content to live off the root instead of retaining the directory as a prefix:

```json
{
  "permalink": "/{%raw%}{{ {{ page.fileSlug }} }}{%endraw%}"
}
```

> Review more [permalink structure tips](/tips/permalinks/)
