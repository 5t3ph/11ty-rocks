---
title: "Eleventy Collection Schemas"
description: "Use this 11ty plugin to enforce a typed frontmatter schema for templates within an Eleventy collection."
date: 2023-02-17
---

A standout feature of Eleventy is [the data cascade](https://www.11ty.dev/docs/data-cascade/). This is the priority order of how global data, front matter data, and other data sources are computed for a given template.

Additionally, Eleventy allows the creation of [collections of data](https://11ty.rocks/posts/creating-and-using-11ty-collections/). Often the reason for a collection is that the content has shared traits.

Let's consider a collection of blog posts, where your layout assumes availability of the following bits of data:

- title
- description
- excerpt

None of these are going to be enforced or type-checked by Eleventy. But perhaps its important to you to make `title` and `description` required keys. Or in the future, you add a `draft` key that you want to ensure is a boolean, or an `order` field that should be a number.

## Introducing: Collection Schemas

[Collection Schemas](https://github.com/5t3ph/eleventy-plugin-collection-schemas) is an Eleventy plugin that allows you to enforce a typed frontmatter schema for templates within an Eleventy collection. It works by you defining a unique schema per collection, then providing output during development and builds to note incorrectly typed, missing, invalid, or misplaced custom data keys.

![example plugin output within the terminal for the conditions listed below](/img/output.png)

<small>_Terminal output example shown in VS Code using the theme [Apollo Midnight](https://marketplace.visualstudio.com/items?itemName=apollographql.apollo-midnight-color-theme)_</small>

**Conditions evaluted for include**:

- Missing required meta keys: `[LIST]`
- Possibly misplaced meta keys: `[LIST]`
- Incorrect type for meta `[KEY]`, change to `[TYPE]`
- Invalid meta keys: `[LIST]`

Where "invalid" catches typos or extra, untyped keys that may need to be added to the schema.

### How collection schemas work

The plugin introduces a new file extension of `.meta` (which is configurable) to design your schema with JSON. So for our blog post example, you might have the schema of:

```json
{
  "title": {
    "type": "string",
    "required": true
  },
  "description": {
    "type": "string",
    "required": true
  },
  "excerpt": {
    "type": "string",
    "required": false
  }
}
```

This `.meta` file slots into the data cascade similar to a directory data file, so it will need the same name as the parent directory of your collection. To associate the schema with the collection, the collection will also need the same name.

```text
posts/
  posts.meta
  pages.json
  page-one.md <- content in any templating language
```

Where `pages.json` is a directory data file that creates the collection via the tags mechanism:

```json
{
  "tags": "pages"
}
```

> ✨ Tip: You can also use the directory data file to [change the permalink for all templates](https://11ty.rocks/tips/permalinks/) in a collection if you don't want them to have the collection name as the URL base.

The plugin leverages the filter capability to obtain the page's total computed data, which will include the schema from the `.meta` file, and then will log any issues to the console.

To finish tying the schema to the collection via the filter, you'll also need to create a global data file called `eleventyComputed.js` (or extend an existing one) to include the following:

```js
module.exports = {
  metaSchema: function (data) {
    return this.metaSchema(data);
  },
};
```

> Review all the [installation and configuration options](https://github.com/5t3ph/eleventy-plugin-collection-schemas) for the plugin.

Then, nest any of your schema-related keys under the `meta` key within template front matter:

```
---
meta:
  title: "My Page Title"
  description: "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin."
---
```

## Schema Limitations

- Only one level of schema data is currently possible
- Only the top-level collection is used to locate schemas
