---
title: "Plugin: Social Images"
icon: 🖼
link: https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-social-images
linkText: Docs and Install
category: plugin
order: 4
date: 2020-11-01
---

[Based on my tutorial](https://dev.to/5t3ph/automated-social-sharing-images-with-puppeteer-11ty-and-netlify-22ln), this package creates dynamic images sized for social media tags (particularly Twitter and Facebook) based on your available pages. Use one of [the predefined color themes](https://github.com/5t3ph/eleventy-plugin-social-images/tree/main/themes), or define your own style, template, or both to customize the layout (like [the ones in use on 11ty Rocks](https://11ty.rocks/img/previews/create-your-first-basic-11ty-website.png)).

Configure the CLI script to run after your Eleventy build, and by default images will be created in `_site/previews/` as png images. Use the CLI options to define a custom `outputDir` and/or a custom `imageDir`.
