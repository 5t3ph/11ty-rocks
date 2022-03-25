---
title: "Ignore Eleventy Files With Environment Variables"
description: "Using environment variables and the Eleventy config option to ignore files, we can exclude files or directories depending on our build process."
templateEngineOverride: md
date: 2022-03-25
---

In this example, we exclude the "\_\_docs" directory from a production build. Environment variables are injected as part of either the "start" or "build" command, with the cross-env package used to ensure compatibility with Mac or PC.

Watch how this works, or continue reading and review the code snippets.

<div class="tdbc-video"><iframe src="https://www.youtube.com/embed/JqtdsuPleSk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

> Check out [the design system project on GitHub](https://github.com/5t3ph/11ty-design-system-example).

## Step one: Include environment variables

When developing an Eleventy project, it's common to include a couple of commands in `package.json` to run Eleventy as a local server and then to do a production-ready build for a web host.

Here's an example of a very basic set of scripts:

```json
// located in package.json
"scripts": {
  "start": "npx @11ty/eleventy --serve",
  "build": "npx @11ty/eleventy"
},
```

I recommend running `npm install cross-env` so that including environment variables at this state works for both PC and Mac users.

We'll update both of our scripts to inject an environment variable called `ELEVENTY_ENV` with the value of "dev" for the `start` command, and the value of "prod" for the `build` command.

```json
"scripts": {
  "start": "cross-env ELEVENTY_ENV=dev npx @11ty/eleventy --serve",
  "build": "cross-env ELEVENTY_ENV=prod npx @11ty/eleventy"
},
```

## Step Two: Ignore files from within the Eleventy config

Within `.eleventy.js` - [the Eleventy config file](https://www.11ty.dev/docs/config/) - we'll add just a few lines.

An `if` statement will check for whether our "prod" environment variable is available, and if so, we'll use [Eleventy's `ignore` feature](https://www.11ty.dev/docs/ignores/) to exclude our `__docs` directory. This effectively prevents those files from building.

```js
if (process.env.ELEVENTY_ENV === "prod") {
  eleventyConfig.ignores.add("./src/__docs/");
}
```

Note that in this example project, `src` is what the input directory has been customized to, and `__docs` is just an example of a directory you may want to exclude.

If you experience a build error, you may need to run `npm install dotenv` and then `require` it at the top of the config file, like so:

```js
require("dotenv").config();
```

---

> Here's [more tips for managing environment variables](/tips/env-variables/) in Eleventy.
