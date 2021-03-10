---
title: "VSCode Settings"
description: " Helpful VSCode settings for working on 11ty projects."
date: 2021-02-15
---

> The following are intended to be added within your VSCode `settings.json`.

## Extend Emmet for Nunjucks

There are two steps to getting Emmet to work for Nunjucks.

First, if you haven't already, install the [Nunjucks syntax highlighting extension](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks).

Next, add the following to specifically extend Emmet to Nunjucks:

```json
"emmet.includeLanguages": {
  "nunjucks": "html"
},
```

> You can also use this setting to extend to Liquid or other file types.

## Language Specific Editor Settings

For myself, I have the following overrides for Markdown and Nunjucks which override my standard setting of `80` characters per column:

```js
"[markdown]": {
  "editor.wordWrapColumn": 100,
  "editor.wordWrap": "bounded",
  // Turned off to prevent Emmet when writing code fenced blocks
  "editor.quickSuggestions": false
},
"[nunjucks]": {
  "editor.wordWrapColumn": 100,
  "editor.wordWrap": "bounded"
},
```

> You can extend these to other templating languages you may be using.
