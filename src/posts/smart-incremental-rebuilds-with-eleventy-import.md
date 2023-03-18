---
title: "Smart Incremental Rebuilds With eleventyImport"
description: "Ensure templates that display content from collections, like a blog index, rebuild when associated collection content changes."
date: 2023-03-18
---

The Eleventy v2 release [improved incremental builds](https://www.11ty.dev/docs/usage/incremental/) in several ways.

However, a standing issue had been that when you display content from a collection and run an incremental build, that content wouldn't be updated in-sync. You would have to stop an restart your build, or opt back out of incremental local dev.

An additional method was added in v2 to resolve this behavior, and allow you to define which collections can re-build an associated template.

## Using `eleventyImport`

The `eleventyImport` object can be added via front matter with one child parameter of `collections` that has an array value. The array should contain the names of any collections you process content from on the page.

The docs for this feature give a `post` collection as the example:

```twig
---
eleventyImport:
  collections: ["post"]
---
<ul>
{% raw %}{%- for post in collections.post -%}
  <li>{{ post.data.title }}</li>
{%- endfor -%}{% endraw %}
</ul>
```

## When will templates rebuild?

Any content change to a collection template will also trigger rebuild. The rebuild is only of the page that includes the `eleventyImport` object, and of the template where content was changed.

As noted on the [incremental builds docs](https://www.11ty.dev/docs/usage/incremental/), rebuild also happens "when you add or delete a tag from a template, any templates using that collection tag... will be rebuilt."

That said, [any way you create a collection](/posts/creating-and-using-11ty-collections/) makes the collection eligible to be included in `eleventyImport`.

## Beware of circular imports

If your blog index resides in your `posts` folder and you are using a [directory data file](/tips/data-directory-file/) to assign the collection, then you'll want to exclude the main index from being included in collections:

```md
eleventyExcludeFromCollections: true
```
