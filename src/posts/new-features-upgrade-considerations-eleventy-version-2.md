---
title: "New Features and Upgrade Considerations for Eleventy v2.0.0"
description: "Review major feature additions, breaking changes, and various enhancements to prepare for the v2 stable release of 11ty."
date: 2023-01-12
templateEngineOverride: md, njk
---

2.0.0 canaries have been available for quite some time, and creator Zach Leatherman has helpfully been updating the docs by adding labels to note when a feature became available.

> The [2.0.0 release](https://www.11ty.dev/blog/eleventy-v2/) is available as of February 8, 2023, which includes the changes noted in this article.

Recently, I set out to create a new Eleventy project for the first time in a few months using the latest Canary and hit some unexpected errors. That led me down the rabbit hole to see what exactly had changed so I could be prepared to update projects, especially as I use similar setups cross-project and maintain a few 11ty starters.

This may not be 100% comprehensive, but it includes the most impactful highlights for general use of 11ty.

> If it’s been a while since you created or updated an Eleventy project, you may want to glance at the last section for [features you might have missed from v1.0.0](#what-you-missed-from-v100).

## Major Feature Additions

### Eleventy Edge

Currently only available for projects run on Netlify, this exciting addition brings a shortcode that allows dynamic content to be added to your projects _on the edge_. What’s that, you say? It means you can modify a page request before the page content is sent to the user, which allows getting data like the user’s timezone. It also enables retrieving cookies to check if the user is authenticated and permitted to access a particular route. Or, it offers the chance to set cookies to persist preferences like a color theme. These ideas are just the beginning of what’s possible with [Eleventy Edge](https://www.11ty.dev/docs/plugins/edge/)!

> Join me on January 25 and 26 for [TheJam.dev](http://TheJam.dev) where I’ll demonstrate using Eleventy Edge to build a membership site on Eleventy.

### WebC

In line with moves made by other site builders, [WebC](https://www.11ty.dev/docs/languages/webc/) offers the ability for single-file web components. Really what that means is WebC is a first-class templating language in Eleventy that you can use to render “real” web components or as an alternative to solutions like Nunjucks includes and macros for reusable components in your 11ty site.

Check out these posts from 11ty Rocks to learn more about WebC use cases and features:

- [Introduction to WebC](https://11ty.rocks/posts/introduction-webc/)
- [Understanding WebC Features and Concepts](https://11ty.rocks/posts/understanding-webc-features-and-concepts/)

## Breaking Changes

[A few changes](https://www.11ty.dev/blog/eleventy-v2/#breaking-changes) as noted in the release notes, which Zach recommends using the [eleventy-upgrade-helper plugin](https://github.com/11ty/eleventy-upgrade-help) to discover whether your site is impacted.

Update from an earlier version of this post: [a proposed breaking change](https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve) to `addPassthroughCopy` was reversed.

## Configuration, Build, and Serve

First up, there are now new options for naming your [Eleventy config file](https://www.11ty.dev/docs/config/#default-filenames).

1. `.eleventy.js` - only option < v2.0.0-canary.15
2. `eleventy.config.js` - coming in v2
3. `eleventy.config.cjs` - coming in v2

The default [Eleventy dev server](https://www.11ty.dev/docs/dev-server/) is now a custom solution instead of BrowserSync. If you have customizations reliant on BrowserSync, you can [revert back](https://www.11ty.dev/docs/dev-server/#swap-back-to-browsersync) with a config option. However, the default server is much faster and lighter and doesn’t require loading any JS during watch and serve local dev.

If your site benefits from programmatic ignores (like separating dev vs. prod environment files), you may be interested to know that `--watch` ignores are now available separately.

- [Regular ignore management](https://www.11ty.dev/docs/ignores/#configuration-api-added-in-v1.0.0)
- [Watch ignore management](https://www.11ty.dev/docs/watch-serve/#configuration-api)

Various enhancements landed for [incremental builds](https://www.11ty.dev/docs/usage/incremental/), notably:

- **Layouts** - a change rebuilds any templates using that layout
- **Collections** - adding or deleting a tag from a template will rebuild any related templates

To make local dev even faster, you may wish to [opt-in to emulated passthrough file copying](https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve) for faster local builds. Note that opting-in may have breaking behavior if you are copying through files that other processes depend on. For instance, maybe you are referencing a file for your serverless build or a plugin requires a precise and real file path from your final output. In that case, simply do not opt-in to this feature.

A new command line flag of `--ignore-initial` will [run Eleventy without an initial build](https://www.11ty.dev/docs/usage/#ignore-initial-to-run-eleventy-without-an-initial-build).

The configuration events added in v1 will have [event arguments](https://www.11ty.dev/docs/events/#event-arguments) available in v2 that provide metadata about the build, including the following objects:

- `dir` - object with current project directories
- `outputMode` - default is `fs` (file system), or [option passed via —to](https://www.11ty.dev/docs/usage/#to-can-output-json-added-in-v1.0.0)
- `runMode` - one of `build`, `watch`, or `serve`
- `results` - for `eleventy.after` only, includes processed Eleventy output

Finally, for configuration updates, if you don’t want directory indexes created by default, you can [change your default permalinks](https://www.11ty.dev/docs/data-eleventy-supplied/#changing-your-project-default-permalinks) with this snippet.

## Custom Data and Data Cascade

The [supplied data variables](https://www.11ty.dev/docs/data-eleventy-supplied/) of `eleventy` (added in v1) and `page` will be available as of v2 in filters and shortcodes. The `page` variable has also been extended to transforms, linters, and collection entries.

I’m a big fan of directory data files ([here are some tips](https://11ty.rocks/tips/data-directory-file/) for using them). In v2, you can configure [a different base file name](https://www.11ty.dev/docs/config/#change-base-file-name-for-data-files) for them instead of the default of matching them to the directory file name, ex. `index`.

[Custom data formats](https://www.11ty.dev/docs/data-custom/) (the ability to support additional template extensions) received various updates.

A late addition for Eleventy Serverless (introduced v1) added the ability to [compile the data cascade](https://www.11ty.dev/docs/plugins/serverless/#compile-the-data-cascade-for-the-project). This means access to collections without extra hoops to make them available to serverless templates (with caveats noted in docs).

## Collections, Filters, and Shortcodes

An exciting update for those of us who have tried to get dynamic/real-time data pulled at build-time is [universal async shortcodes](https://www.11ty.dev/docs/shortcodes/#asynchronous-universal-shortcodes) _and_ [universal async filters](https://www.11ty.dev/docs/filters/#asynchronous-universal-filters)!

Collections received a couple of updates, including:

- [declaring collections for incremental builds](https://www.11ty.dev/docs/collections/#declare-your-collections-for-incremental-builds) to trigger rebuilds when a collection item is changed
- [new/updated data structure for collection items](https://www.11ty.dev/docs/collections/#collection-item-data-structure), notably:
  - Use `page.url` instead of `url` (see docs for other properties moved to `page`)
  - Use `content` instead of `data.templateContent` to get the compiled output

You can now [chain ‘log’ in filters](https://www.11ty.dev/docs/filters/log/#using-log-in-filter-chains), for example `{% raw %}{{ myData | log | otherFilter }}{% endraw %}`. Whereas before, you would have to break those calls apart, now `log` will output and then pass the data along the chain to the next filter.

## Content Creation

Here are some quick hits that may impact how you create content with Eleventy:

- [new date option](https://www.11ty.dev/docs/dates/): `git Created`
- pagination option to [allow empty pages](https://www.11ty.dev/docs/pagination/#generating-an-empty-results-page) when no data is available
- [map one URL to multiple files](https://www.11ty.dev/docs/permalinks/#mapping-one-url-to-multiple-files-for-internationalization), useful for scenarios like internationalization
- Markdown processing by default now has [disabled indented code blocks](https://www.11ty.dev/docs/languages/markdown/#indented-code-blocks)

Also, when defining layout files, it is now [strongly recommended to include the layout file extension](https://www.11ty.dev/docs/layouts/#omitting-the-layouts-file-extension). This is due to the slowness of determining which file is actually meant to be used when no extension is included.

```text
---
layout: base <- no longer recommended
layout: base.njk <- best practice: always add file extension
---
```

## Upgrading to v2.0.0

The top two things that may impact your current projects are:

- changing [collection data references](#collections-filters-and-shortcodes) like `url` to be based off of `page` and updating `templateContent` to `content`
- [including the file extension](#content-creation) when you define a layout, ex `layout: base.njk` instead of `layout: base`

And, perhaps you may want to [change the name of your Eleventy config](#configuration-build-and-serve).

There's also an upgrade plugin available: [eleventy-upgrade-help](https://github.com/11ty/eleventy-upgrade-help)

## What You Missed From v1.0.0

I started using Eleventy at version 0.10.0 in April 2020, and v1.0.0 stable was released a year and a half later, on [January 9, 2022](https://www.11ty.dev/blog/eleventy-one-point-oh/). If you also did most of your learning with Eleventy before v1 and haven’t updated things or built new in a while, there’s a good chance you missed some of the following!

Probably the biggest feature splash was [Eleventy Serverless](https://www.11ty.dev/docs/plugins/serverless/), which enables building entire templates upon page request for fully dynamic pages. The two available modes are:

- **On-demand builders** which cache the result after the first page request (rebuild to expire), great for infrequently used pages or generating open graph images
- **Dynamic templates** which re-render on every page request, great for CMS previews, accepting user input, or even to [generate and display site search results](https://11ty-serverless-search.netlify.app/)

Here are several other key updates from Eleventy v1.0.0:

- `slug` filter changed to `slugify` with [better special character handling](https://www.11ty.dev/docs/filters/slugify/)
- [Date formats](https://www.11ty.dev/docs/dates/) are assumed to be UTC
- Noted earlier, but [configuration events](https://www.11ty.dev/docs/events/) to run code `before` or `after` compile
- [Data deep merge on by default](https://www.11ty.dev/docs/data-deep-merge/) resulting in data like tags that are added in a template and a layout being merged together, rather than the template, which has higher data cascade priority, having only its tags used
- Speaking of the data cascade, the priority of [front matter data in layouts](https://www.11ty.dev/docs/data-cascade/#sources-of-data) was _lowered_
- Global data was allowed to be [added from the config file](https://www.11ty.dev/docs/data-global-custom/)
- [Custom template extensions](https://www.11ty.dev/docs/languages/custom/) allow adding your own template formats _and_ provide a custom compiler, such as the docs example of adding Sass processing
- The [render plugin](https://www.11ty.dev/docs/plugins/render/) enables shortcodes to render template strings or files inside of a template of a different template language, ex. render a Markdown block within Nunjucks

---

Whew, that was a lot! Go forth and enjoy building with these new and updated Eleventy features! **PS - if you're new to Eleventy**, check out my guide to [creating your first basic 11ty website](/posts/create-your-first-basic-11ty-website/).
