---
title: "Process CSS or Sass With LightningCSS"
description: "Use these plugins or code snippets to make CSS a first-class templating language in Eleventy and add processing with LightningCSS and/or Sass."
date: 2023-02-25
---

To easily process CSS with Sass and/or LightningCSS, simply grab these plugins:

- [Sass and LightningCSS](https://github.com/5t3ph/eleventy-plugin-sass-lightningcss)
- [LightningCSS only](https://github.com/5t3ph/eleventy-plugin-lightningcss)

> I've written a [comparison of using Sass vs only LightningCSS](https://thinkdobecreate.com/articles/is-it-time-to-replace-sass/) if you're unsure which method you'd like to use.

If you want to learn how they work or how to more manually include these in your Eleventy build, read on!

## Custom Template Languages in Eleventy

A powerful feature added in the Eleventy v1 release was the ability to add custom template extensions and template formats. Additionally, you can include a custom compile function.

This opens the possibility to extend processing during build to tools like Sass, or run additional processing against already recognized types like JavaScript such as to minify.

Or, [as the docs show](https://www.11ty.dev/docs/languages/custom/), you can even invent a file type in order to customize the output in some way.

We'll be taking advantage of this feature to add our custom processing of Sass or CSS files.

## Adding Sass Support

The docs actually use Sass as the example for adding support, but here is the compiled snippet with the key features to include.

First, you'll need to install the sass package - `npm install sass` - and also include it in your config.

```js
const sass = require("sass");
```

Then, the following should be placed within your config export:

```js
// Recognize Sass as a "template languages"
eleventyConfig.addTemplateFormats("scss");

// Compile Sass
eleventyConfig.addExtension("scss", {
  outputFileExtension: "css",
  compile: async function (inputContent, inputPath) {
    // Skip files like _fileName.scss
    let parsed = path.parse(inputPath);
    if (parsed.name.startsWith("_")) {
      return;
    }

    // Run file content through Sass
    let result = sass.compileString(inputContent, {
      loadPaths: [parsed.dir || "."],
      sourceMap: false, // or true, your choice!
    });

    // Allow included files from @use or @import to
    // trigger rebuilds when using --incremental
    this.addDependencies(inputPath, result.loadedUrls);

    return async () => {
      return result.css;
    };
  },
});
```

## Autoprefixing and Minification with LightningCSS

If you are using more modern CSS features, you'll want to at least include prefixing. And for even more support of other upcoming features like nesting, color functions, media query range syntax I encourage using [LightningCSS](https://lightningcss.dev/).

We can update the previous snippet to include LightningCSS so that we still support Sass processing.

First, install both `lightningcss` as well as `browserslist`.

```js
npm install lightningcss browserslist
```

And include those in your config:

```js
const browserslist = require("browserslist");
const { transform, browserslistToTargets } = require("lightningcss");
```

We've had to include both things so that we can pass browser compile targets to LightningCSS, otherwise prefixing and other transforms of modern CSS would not be applied. This handy web app will help you [decide on your browserslist targets](https://browsersl.ist/#q=%3E+0.2%25+and+not+dead).

In our earlier Sass snippet, we'll update the final return section:

```js
let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

return async () => {
  let { code } = await transform({
    code: Buffer.from(result.css),
    minify: true,
    sourceMap: false,
    targets,
  });
  return code;
};
```

> Use the [Eleventy plugin for Sass and LightningCSS](https://github.com/5t3ph/eleventy-plugin-sass-lightningcss) to use this setup without adding all of this manually to your config.

## Process with LightningCSS Only, No Sass

If Sass isn't something you want to use, then we can remove the Sass bits and only process our CSS with LightningCSS.

You'll still need to install the following:

```js
npm install lightningcss browserslist
```

Then include them in your config:

```js
const browserslist = require("browserslist");
const { bundle, browserslistToTargets, composeVisitors } = require("lightningcss");
```

And here's the full snippet to place in your config. This includes a preference to allow "bundling" which enables including other files via the `@import` syntax. The snippet also assumes those files are prefixed with `_` which you can omit or change to your preference.

```js
// Recognize CSS as a "template language"
eleventyConfig.addTemplateFormats("css");

// Process CSS with LightningCSS
eleventyConfig.addExtension("css", {
  outputFileExtension: "css",
  compile: async function (_inputContent, inputPath) {
    let parsed = path.parse(inputPath);
    if (parsed.name.startsWith("_")) {
      return;
    }

    let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

    return async () => {
      // Switch to the `transform` function if you don't
      // plan to use `@import` to merge files
      let { code } = await bundle({
        filename: inputPath,
        minify: true,
        sourceMap: false,
        targets,
        // Supports CSS nesting
        drafts: {
          nesting,
        },
      });
      return code;
    };
  },
});
```

> A [plugin to process CSS with LightningCSS](https://github.com/5t3ph/eleventy-plugin-lightningcss) only is also available.

## Plugin or Manual Include?

The benefit of the plugin is that it will also automatically get your browserslist definition, and you can just drop it in across projects.

A manual include is great if you want to customize beyond what the plugins allow, or want to own the responsibility of updating the dependencies.
