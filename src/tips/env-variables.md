---
title: "Managing `.env` Variables"
description: "Set up a way to retrieve `.env` variables within your site content, layouts, and config."
date: 2020-11-23
---

Environment variables are a way to retrieve values that may come from build processes, and are sometimes sensitive, like API keys. For local development access, those are typically stored in a `.env` file at the root of your site, and _not checked in_ to version control in order to keep them private.

## Creating and Accessing `.env` Variables

You you may want to create your own variables to determine the difference between your `production` vs `development` environment.

For this, you'll start with a modification to your build scripts, such as:

```js
"start": "cross-env ELEVENTY_ENV=dev eleventy --serve",
"build": "cross-env ELEVENTY_ENV=prod eleventy",
```

_I'm including `cross-env` for cross-platform compatibility_.

Then add to a `_data` file of your choice, perhaps to [your site's `meta.js`](/tips/site-metadata/) or a dedicated file:

```js
module.exports = {
  env: process.env.ELEVENTY_ENV,
};
```

### Access `.env` Value With Templating

Then you can output the value as demonstrated for the other `meta` keys, or use within templating such as to control whether or not analytics scripts are included:

```twig
{% raw %}{% if meta.env == 'prod' %}
// analytics here
{% endif %}{% endraw %}
```

### Access `.env` Values in `.eleventy.js`

If you are trying to access environment values in `.eleventy.js`, you will access them directly as `process.env.ELEVENTY_ENV`.

If you set `.env` variables in an actual `.env` file and/or as part of your build pipeline, you will need to include the following in the custom `_data` or `.eleventy.js` file:

```js
// First `npm install dotenv`
require("dotenv").config();

// Example access
const API_KEY = process.env.API_KEY;
```
