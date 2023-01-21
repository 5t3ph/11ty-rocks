---
title: "11ty Community Links: January 2023"
description: "11 nifty resources from the Eleventy community, including CSS and JS processing, sharing WebC components, and organization the config."
date: 2023-01-21
---

1. Chris Coleman - “[Using Eleventy filters in Directory Computed Data](https://illtron.net/2023/01/11ty-directory-data-filters/)” - shows how a switch to using `11tydata.js` instead of JSON for data directory files allows regular JS and therefore more complex logic to work out assigning values for computed data.
2. Benny Powers - “[SVG Icon Sprites in Eleventy](https://bennypowers.dev/posts/11ty-svg-sprites/)” - uses a technique of creating a collection out of a directory of SVG icons and programmatically turning those into an SVG sprite, and a clever way to add the sprite only once per page where at least one of the associated shortcodes is used.
3. Vadim Makeev - “[CSS and JavaScript as first-class citizens in Eleventy](https://pepelsbey.dev/articles/eleventy-css-js/)” - shows how to use the v2 additions of `addTemplateFormats` and `addExtension` to process CSS and JS.
4. David Darnes - “[Compile JavasScript and Sass in Eleventy using Uglify JS and Sass lib](https://gist.github.com/daviddarnes/8d70d7b8eaee474bcb19e30fc45e63ff)” - is a gist that gives a little different take from Vadim’s article but using the same 11ty features.
5. Christopher Kirk-Nielsen - “[Eleventy Asset Pipeline: Precompiled Assets without Gulp](https://chriskirknielsen.com/blog/eleventy-asset-pipeline-precompiled-assets/)” - demonstrates an alternative to the previous two articles with the use of `eleventy.before` as well as addressing a bit different goals.
6. Ashur Cabrera - “[Importing external components in WebC via NPM](https://multiline.co/mment/2022/12/importing-external-webc-components)**”** - explores using `webc:import` to share WebC components between projects.
7. Lene Saile - “[Organizing the Eleventy config file](https://www.lenesaile.com/en/blog/organizing-the-eleventy-config-file/)” - provides some excellent considerations and techniques for taming your 11ty configuration setup.
8. Also from Lene - “[Eleventy Excellent](https://github.com/madrilene/eleventy-excellent)” - looks like a truly excellent starter to get an 11ty site going quickly!
9. Eleventy Blog / Zach Leatherman - “[The very first beta release of Eleventy v2.0](https://www.11ty.dev/blog/eleventy-v2-beta/)” - the official announcement of the v2 Beta!
10. 11ty Rocks / Stephanie Eckles - “[New Features and Upgrade Considerations for Eleventy v2.0.0](https://11ty.rocks/posts/new-features-upgrade-considerations-eleventy-version-2/)” - provides a little more context on the major feature additions, breaking changes, and various enhancements to help you prepare for v2.
11. Bryan Robinson - “[11ty Second 11ty](https://www.youtube.com/playlist?list=PLOSLUtJ_J3rrNiBBN-wn2BJ11OHiBuC1n)” - a YouTube series where Bryan shows off features of Eleventy in snack-size videos.

> Add your own original article on a unique 11ty topic to the [11ty Rocks Community Resource](https://11ty.rocks/community/) page!
