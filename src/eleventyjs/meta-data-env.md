---
title: "Site Meta Data and `.env` Variables"
description: "Create a central data store for your meta data and to retrieve `.env` variables."
date: 2020-11-23
---

## Site Meta Data

There are certain bits of data about your site that are useful to store in a centralized location.

One way to handle this is by creating a local data file to hold this "meta data". It can also hold `.env` variables.

Here's an example ripped right from this site, but originally borrowed from the official [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) and also the method provided [in my starter]():

```js
module.exports = {
  url: process.env.URL || "http://localhost:8080",
  siteName: "11ty Rocks!",
  siteDescription:
    "A collection of Eleventy (11ty) starters, projects, plugins, and resources created by Stephanie Eckles (@5t3ph).",
  authorName: "Stephanie Eckles",
  twitterUsername: "5t3ph",
};
```

Because the `_data` directory is the expected place for Eleventy to look for data, you can now use any value from this file like so:

```js
<meta name="description" content="{% raw %}{{ meta.siteDescription }}{% endraw %}" />
```

## Creating and Accessing `.env` Variables

Note that we also stuck in an `.env` variable for the `url` key, with the particular one used being a value available when deploying to Netlify, so your host may be different or you may have to specifically set it up.

You may also want to set your own variables to determine the difference between your `production` vs `development` environment.

For this, you'll start with a modification to your build scripts, such as:

```js
"start": "cross-env ELEVENTY_ENV=dev eleventy --serve",
"build": "cross-env ELEVENTY_ENV=prod eleventy",
```

_I'm including `cross-env` for cross-platform compatibility_.

Then add to your `meta.js`:

```js
env: process.env.ELEVENTY_ENV,
```

Then you can output the value as demonstrated for the other `meta` keys, or use within templating such as to control whether or not analytics scripts are included:

```js
{% raw %}{% if meta.env == 'prod' %}
// analytics here
{% endif %}{% endraw %}
```

If you are trying to access those values in `.eleventy.js`, you will access them directly as `process.env.ELEVENTY_ENV`.

If you set `.env` variables in an actual `.env` file and/or as part of your build pipeline, you will need to include the following in the custom `_data` or `.eleventy.js` file:

```js
// First `npm install dotenv`
require("dotenv").config();

// Example access
const API_KEY = process.env.API_KEY;
```
