---
title: "Site Metadata"
description: "A useful technique to manage site metadata (title, description, url, etc) for ease of retrieval throughout templates and content."
date: 2021-02-15
---

The `_data` directory is an expected location for various data sources for your Eleventy site.

A convention you'll see variations of in several starters is a data file to hold site metadata. This concept is useful for creating extendable solutions so that certain template bits don't need repeated or started from scratch everytime.

Here's the one that's included in my [11ty Netlify Jumpstart](https://11ty-netlify-jumpstart.netlify.app/) which you can adapt to your own needs:

```js
// Located in _data/meta.js
module.exports = {
  // NOTE: `process.env.URL` is provided by Netlify, and may need
  // adjusted pending your host
  url: process.env.URL || "http://localhost:8080",
  siteName: "",
  siteDescription: "",
  authorName: "",
  twitterUsername: "", // no `@`
};
```

Then, you can access that data in templates and content by using the filename first, followed by the data key of what you'd like using dot notation.

For example, if I wanted the `siteName` I could access it within Nunjucks as:

```twig
{%raw%}{{ meta.siteName }}{%endraw%}
```

> See this idea in use for the [11ty Netlify Jumpstart `base` template](https://github.com/5t3ph/11ty-netlify-jumpstart/blob/main/src/_includes/base.njk)
