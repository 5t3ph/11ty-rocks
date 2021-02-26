---
title: "Custom BrowserSync Options"
description: "Learn how to open the browser when Eleventy is served by BrowserSync."
date: 2021-02-25
---

## Including Opening a Browser on Launch

By default, Eleventy has the BrowserSync option to open a browser set to `false`.

Fortunately, it also provides a way to override the BrowserSync settings, so we can allow opening a browser with the following:

```js
eleventyConfig.setBrowserSyncConfig({
  open: true,
});
```

If you use VSCode, you may also be interested in [creating a launch task](https://dev.to/5t3ph/automatically-start-scripts-on-launch-in-vscode-6ak) to enable running your Eleventy start command when you open your project.

> Review the [official 11ty docs on BrowserSync](https://www.11ty.dev/docs/watch-serve/#override-browsersync-server-options) for more info.
