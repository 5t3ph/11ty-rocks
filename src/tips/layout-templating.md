---
title: "Layout Templating"
description: "Tips for creating Eleventy layouts."
date: 2021-04-16
---

## Body Classes for Pages and Layouts

A trick I originally learned from WordPress templates is to add a class on the body to identify the page being viewed. This helps you have page-specific style rules.

The `{% raw %}{{ page.fileSlug }}{% endraw %}` is an Eleventy provided data variable that will be the original file name without the extension.

> This will be the file name only, not the path. So `/blog/post-one.md` would render `post-one`.

Our logic includes the class of "home" when there is no `fileSlug` available since the the main `index` will not compute a `fileSlug`.

```twig
<body
  class="page--{% raw %}{% if page.fileSlug %}{{ page.fileSlug }}{% else %}home{% endif %}{% endraw %}">
```

You may also add the layout in a similar way:

```twig
<body class="layout--{% raw %}{{ layout }}{% endraw %}">
```

> Note: If layouts are chained, then `{% raw %}{{ layout }}{% endraw %}` will render out the _lowest_ layout in the chain. So if `blog.njk` chains to `base.njk`, it will select `blog`.
