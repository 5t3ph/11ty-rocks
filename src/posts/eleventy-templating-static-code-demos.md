---
title: "Use Eleventy Templating To Include Static Code Demos"
description: "Create a single-page site that composites working code examples by leveraging Nunjucks templating abilities and custom collections and shortcodes."
date: 2021-04-02
templateEngineOverride: md, njk
---

> This post assumes a foundational familiarity with Eleventy. If you're new to 11ty - welcome! You may want to [start here](/posts/create-your-first-basic-11ty-website/).

This tutorial will showcase many features of Nunjucks templating. So, even if the tutorial's goal doesn't match your use case, you'll get more familair with using it as a templating language!

## Project Brief

The goal of this Eleventy project is to create a single-page site that displays live code demos, like the setup on [SmolCSS.dev](https://smolcss.dev). And we'll see how to extend it to a scoped context like is used for [this ModernCSS.dev tutorial](https://moderncss.dev/developing-for-imperfect-future-proofing-css-styles/).

Here are the base requirements:

- ease of managing demo content
- demo code lives with demo content
- each demo is an independent file
- allow custom ordering of demos vs. date-based
- RSS feed for demos
- "Open in CodePen" functionality

## Base Project Configuration

We're starting from an empty project with Eleventy installed and ready to run.

This tutorial will assume a customized `input` directory of `src`, and that you've created an `index` file where we'll eventually add the demo content.

If you're unsure how to do those things, follow my tutorial on [creating your first 11ty site](/posts/create-your-first-basic-11ty-website/) up until the _Create the Blog_ step, and then come back to continue! 😊

You may also want to do the "Create a CSS File" and "Link to Stylesheet" sections in that tutorial if you are unfamiliar with how to do that with Eleventy.

> Setup your index as `index.njk` as we'll primary be using Nunjucks for this tutorial.

## Base Eleventy Setup for Single-Page Content

My favorite thing about Eleventy is the flexible content modeling. And most projects I do definitely benefit from the filesystem page creation, but for this project we'll need to disable that functionality.

So, our first step is to create a location for our code demos to live. Add `src/demos`, and then create the file `demos.json` with the following contents:

```js
{
  "tags": "demos",
  "permalink": false
}
```

This is a _directory data file_ and we define `tags` to create the `demos` collection. Then we set `permalink` to `false` to prevent page generation. These values will apply to all content within the directory, although you could still set front matter to override them for specific content.

## Create a Demo File

Let's create our first demo. Add `demo/centering.njk` with the following content:

```md
---
title: "CSS Centering"
order: 1
date: 2021-03-31
templateEngineOverride: njk, md
---
```

We include an `order` property that we'll use to order our demos within our single page rather than relying on Eleventy's default of date-based ordering. This is because we may create multiples on the same day, and on publish they may change order from what we see locally.

There is also a date included for purposes of correctly updating the RSS feed we'll be adding.

Finally, we add `templateEngineOverride: njk, md` because we will be mixing Markdown with Nunjucks content in this file and we want both to be processed correctly.

## Demo Partial and Code Content

You may be wondering why we didn't add any content in the previous step. Instead of directly outputting the content within the demo Nunjucks file, we're going to populate Nunjucks variables to pass into a partial. This will enable consistency among our code demos and allow enhanced functionality.

Create `src/_includes/demo.njk` which will be our partial.

Let's determine the parts we need to output for each demo:

- a title
- a description
- HTML
- CSS

Now, since this is a case study of [SmolCSS.dev](https://smolcss.dev), we're going to focus on showing the CSS as highlighted code. You can extend the following ideas to also show the HTML, or perhaps only the HTML, or even add JavaScript into the mix.

Within `demo.njk` let's populate our demo template:

```twig
{% raw %}{{ description | safe }}{% endraw %}

<style>
{% raw %}{{ css | safe }}{% endraw %}
</style>

<details>
  <summary>CSS for "{% raw %}{{ title }}{% endraw %}"</summary>

  {% raw %}{% highlight "css" %}{% endraw %}
  {% raw %}{{- css | safe }}{% endraw %}
  {% raw %}{% endhighlight %}{% endraw %}
</details>

<div class="demo">
{% raw %}{{ html | safe }}{% endraw %}
</div>
```

Now this partial accepts the following variables:

- `title` - used within the `summary` element since we're going to use the native HTML `details` element to enable collapsing the demo code
- `description` - included with the `safe` filter because the content will be pre-compiled from Markdown into HTML
- `css` - added twice so that it can be output as actual CSS within `style` tags, and also within a `highlight` block that will become the demo's sample code
- `html` - added within a `div.demo` so that we can style the demo container around the passed HTML content

Let's go back to our first demo file and add the content within these variables:

```twig
{% raw %}{% set description %}{% endraw %}

**Put down the CSS centering jokes**! This modern update is often the solution you're looking for to solve your centering woes.

{% raw %}{% endset %}{% endraw %}

{% raw %}{% set css %}{% endraw %}
.centering {
  display: grid;
  place-content: center;
}
{% raw %}{% endset %}{% endraw %}

{% raw %}{% set html %}{% endraw %}
<div class="centering">
  <span>Feeling Centered</span>
</div>
{% raw %}{% endset %}{% endraw %}

{% raw %}{% include "demo.njk" %}{% endraw %}
```

This sets the variables, and also includes the `demo` partial. For each demo file you create, continue this pattern of setting variables and including the partial.

Before we see some example output, this also assumes you are using [eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/) and have pre-included a [prism theme](https://github.com/PrismJS/prism-themes).

Here's some starting CSS for the `details`, `summary`, and `.demo`:

```css
details {
  margin: 2rem 0 0;
}

details pre[class*="language-"] {
  margin: 0;
}

summary {
  padding: 0.15em 0.5em;
  background-color: #0d3233;
  color: #fff;
  cursor: pointer;
}

summary:focus {
  outline: 2px solid #0d3233;
  outline-offset: 2px;
}

.demo {
  min-height: 30vh;
  padding: 1rem;
  border: 2px dashed currentColor;
}
```

### Example Code Demo Output

{% set title = "Demo Output" %}
{% set description %}

**Put down the CSS centering jokes**! This modern update is often the solution you're looking for to solve your centering woes.

{% endset %}

{% set css %}
.centering {
  display: grid;
  place-content: center;
  min-height: 30vh;
}

.centering span {
  padding: .5em;
  outline: 2px solid;
}
{% endset %}

{% set html %}

<div class="centering">
  <span>Feeling Centered</span>
</div>
{% endset %}
{% include "csscode.njk" %}

### Extend the Code Partial

The great thing about handling this via a partial that is passed variables to modify behavior is that you can build up _more_ variables to alter the output when needed.

For example, maybe you don't _always_ have HTML and description output and just want to show the CSS. So, you could create and handle for a `hideDemo` variable:

```twig
{% raw %}{% if not hideDescription %}{% endraw %}
{% raw %}{{ description | safe }}{% endraw %}
{% raw %}{% endif %}{% endraw %}

{% raw %}{% if not hideDemo %}{% endraw %}
<div class="demo">
{% raw %}{{ html | safe }}{% endraw %}
</div>
{% raw %}{% endif %}{% endraw %}
```

Which would be set as follows within your code file:

```twig
{% raw %}{% set hideDescription = true %}{% endraw %}
{% raw %}{% set hideDemo = true %}{% endraw %}
```

Resulting in only the details/summary appearing:

{% set hideDescription = true %}
{% set hideDemo = true %}
{% include "csscode.njk" %}

> **Challenge**: Extend this to make the `open` property for `details` a variable so that you have the option to set the `details` to visible instead of collapsed

## Ordering and Output of the `demos` Collection

Now that we have our demo code files and partial figured out, it's time to figure out how to display this content. Remember - we turned off the default file system individual page creation.

We also had created a collection called `demos` when we defined the directory data file by assigning all of the files the tag of `demos`.

However, that collection will currently be date based as is the 11ty default. Since we want it based off the `order` front matter, we need to create a custom collection.

Add the following within `.eleventy.js` above the previous customization that updated the input/output directories:

```js
eleventyConfig.addCollection("orderedDemos", function (collection) {
  return collection.getFilteredByTag("demos").sort((a, b) => {
    return a.data.order - b.data.order;
  });
});
```

This takes the `demos` collection and reorders it by our custom `order` key and returns a new collection called `orderedDemos`.

Now we can loop through the new collection to output it within our main index:

```twig
{% raw %}{% for demo in collections.orderedDemos %}{% endraw %}
<article>
  <h2 id="{% raw %}{{ demo.fileSlug }}{% endraw %}">{% raw %}{{ demo.data.title }}{% endraw %}</h2>
  {% raw %}{{ demo.templateContent | safe }}{% endraw %}
</article>
{% raw %}{% endfor %}{% endraw %}
```

This is a minimal example where we are adding fully compiled demo `templateContent` within an `article`. We also pass in the main demo front matter `title` within an `h2` that includes an `id` set to the demo's file slug in case you'd like to enable anchor links to each demo.

## RSS Feed

To setup an RSS feed, install the `eleventy-plugin-rss` plugin and follow the instructions and use the example code from [the RSS plugin docs](https://www.11ty.dev/docs/plugins/rss/).

The only alteration is to change from the `posts` collection to use our `orderedDemos` collection to correctly order the feed. In addition, you'll need to pass the `reverse` filter, resulting in the following start of the feed loop:

```twig
{% raw %}{%- for item in collections.orderedDemos | reverse %}{% endraw %}
```

## "Open in CodePen"

A bit of functionality that provides a valuable extra resource for our readers is the ability to export the demo code to CodePen.

I've abstracted my solution as used on SmolCSS.dev and ModernCSS.dev into the plugin [`@11tyrocks/eleventy-plugin-open-in-codepen`](https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-open-in-codepen).

Here's an example of configuring the plugin:

```js
const openInCodepen = require("@11tyrocks/eleventy-plugin-open-in-codepen");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(openInCodepen, {
    siteUrl: "YourSite.dev",
    siteTitle: "Your Site",
    siteTag: "yoursite",
    buttonClass: "your-button-class",
    buttonIconClass: "your-button-icon-class",
  });
};
```

Which would then make the shortcode `postToCodepen` available within your partial. You can include the button with the following updates:

```twig
// Set in your code demo file
{% raw %}{% set slug = page.url %}{% endraw %}

// Add where you'd like it to appear in the partial
{% raw %}{% postToCodepen title, slug, css, html %}{% endraw %}
```

Here is a working example of the button created by the shortcode (and including customizations specific to 11ty Rocks!) that will export the demo that we set up in this tutorial:

{% set slug = page.url %}
{% postToCodepen title, slug, css, html %}

## Prevent Global Affects on Demo CSS

If your use case is to populate demos within a context where you don't want your site's global CSS to cascade and affect your demo CSS, we can add a shortcode to help scope the styles.

But first, here's a starting set of styles for our `.demo` contents to reset most cascaded properties. You may find you need to add more properties here depending on what elements you are using in the demo. The goal is to prevent most global styles leaking through (and demo styles leaking out!) so that the demo styles are closer to being fresh from a native browser style base. If you are using a style reset, those rules may still come through for certain elements which is likely desireable.

```css
.demo * {
  margin: 0;
  padding: unset;
  border: unset;
  border-radius: unset;
  color: unset;
  font: unset;
  font-family: system-ui, sans-serif;
}
```

Next, we'll create the shortcode. A shortcode can output content, and we'll actually use it to output both the `<style>` and `.demo` blocks, replacing what we previously had for the HTML in the partial.

Here is the content of the `codeDemo` shortcode, which intakes the `css` and `html` (if available). Then it finds the CSS class names, and replaces them with a version that has a "hash" (just a simple random number string for this context). Following that, it traverses the HTML and updates the matched CSS class names so that the hashed CSS selector matches the demo HTML.

```js
eleventyConfig.addShortcode("codeDemo", function (css, html) {
  if (!html.length) return "";

  if (!css) {
    return `
<div class="demo">
${html}
</div>`;
  }

  const hash = Math.floor(Math.random(100) * Math.floor(999));

  const cssRE = new RegExp(/(?<=\.)([\w|-]+)(?=\s|,)/, "gm");
  const cssCode = css.replace(cssRE, `$1-${hash}`);

  let htmlCode = html;
  css.match(cssRE).forEach((match) => {
    // prettier-ignore
    const htmlPattern = match.replace("-", "\\-");
    const htmlRE = new RegExp(`(${htmlPattern})(?=\\s|")`, "gm");
    htmlCode = htmlCode.replace(htmlRE, `${match}-${hash}`);
  });

  return `
<style>${cssCode}</style>
<div class="demo">
${htmlCode}
</div>`;
});
```

A couple notes:

- the indentation isn't an accident but necessary since we have setup our demo to process _both_ Markdown and Nunjucks, and if those blocks are indented it fouls up that processing
- this scoping method requires you to use class selectors, which means if you are using element selectors you will have to prefix them with a class which must exist in the passed HTML

Then in the partial, remove our previous block that output the HTML `.demo` and replace it with the following:

```twig
{% raw %}{% set htmlCode %}{{ '' if hideDemo else html | safe }}{% endset %}{% endraw %}

{% raw %}{% codeDemo css, htmlCode %}{% endraw %}
```

This still takes into account the _option_ to hide the demo.

**Important note about Nunjucks variables**: They will pass through multiple instances of a partial if you include the partial multiple times within one file. If you are writing a tutorial and set the `html` variable at the top of the file, you can repeatedly update the `css` variable only prior to including the partial again and it will use the original HTML up until you update the `html` variable. This is super useful for tutorials showing how to progressively build something. In fact, this technique was created for exactly that purpose over on this [tutorial for ModernCSS.dev](https://moderncss.dev/developing-for-imperfect-future-proofing-css-styles/).

> Phew! That was a lot to learn about Nunjucks templating 😊 I'd love to know if this was helpful to you and see what you make with it! Reach out to [@5t3ph on Twitter](https://twitter.com/5t3ph)
