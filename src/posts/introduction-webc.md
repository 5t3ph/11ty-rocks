---
title: Introduction to WebC
description: What is WebC and what does it have to do with Eleventy?
date: 2022-10-15
meta:
  authorName: W. Evan Sheehan
  authorBio: "[Evan](https://darthmall.net/) is a web developer living in Lafayette, CO and working at the [National Oceanic and Atmospheric Administration](https://noaa.gov/), where he built the website for [Science On a Sphere](https://sos.noaa.gov) (using Eleventy) and now builds applications for scientists. You may also sometimes find him playing traditional Irish music on fiddle, playing board games, or out biking."
---

[WebC](https://github.com/11ty/webc) is a new tool by [Zach Leatherman](https://www.zachleat.com/) (creator of Eleventy) for serializing custom elements at build time. It aggregates component-level CSS and JavaScript, allowing developers to keep their styles and scripts together with the markup as single file components, the way you may be used to if you work with JavaScript frameworks such as [Svelte](https://svelte.dev/) or [Vue](https://vuejs.org/).

All without having to ship a single line of JavaScript to the client — unless you want it to.

## WebC in a nutshell

First and foremost: WebC components are just HTML. If you already know how to write HTML, CSS, and JavaScript, you are ready to start working with WebC.

Let’s define our first component: a footer for our site. We’ll create a file called `site-footer.webc` and put in it the following HTML:

```html
<!-- site-footer.webc -->
<footer>
  <p>&copy; 2022 Yours Truly</p>
</footer>
```

Now we can use a `<site-footer></site-footer>` custom element and WebC will replace that element with the markup from `site-footer.webc`.

> For the purposes of this article, we won’t concern ourselves with [importing components in WebC](https://github.com/11ty/webc#html-imports-kidding-kinda). When you set up the WebC plugin for Eleventy, you can [configure a directory for global components](https://www.11ty.dev/docs/languages/webc/#global-no-import-components) so that they’re always available.

So if we have a file — `page.webc` — with all of our HTML boilerplate, we insert our footer into that file using this custom element.

```html
<!-- page.webc -->
<!doctype html>
<html>
  <head></head>
  <body>
    <site-footer></site-footer>
  </body>
</html>
```

When we process `page.webc`, the resulting HTML will look like this (give or take some whitespace):

```html
<!-- page/index.html -->
<!doctype html>
<html>
  <head></head>
  <body>
    <!-- <site-footer> -->
    <footer>
      <p>&copy; 2022 Yours Truly</p>
    </footer>
    <!-- </site-footer> -->
  </body>
</html>
```

## Single file components

At this point, it may still be unclear what advantages we get by using WebC. After all, many of the template languages that Eleventy already supports allow you to import partials from other files like this. But what WebC can add to even this basic use case is the single file component (SFC) authoring experience.

An SFC is a file that contains HTML, CSS, and JavaScript that defines the component. They often follow this structure:

```html
<script></script>

<!-- Markup here -->

<style></style>
```

Going back to our `site-footer.webc`, we can colocate the styles for our footer with the markup.

```html
<!-- site-footer.webc -->
<footer>
  <p>&copy; 2022 Yours Truly</p>
</footer>

<style>
  footer {
    padding-block: 3rem;
    padding-inline: 1rem;
  }

  footer > p {
    font-family: fantasy;
  }
</style>
```

One advantage to writing your components this way instead of having your markup and styles in separate files is that when you’re making changes, it’s easier to remember to update the styles. If we introduce a `<div>` to our footer to wrap the paragraph at some maximum width, our (admittedly contrived) `footer > p` selector will no longer apply to the copyright notice in the footer. Being able to see the markup and styles right next to each other helps us keep them synchronized.

### Custom elements in WebC output

When you have a component that is just HTML, WebC will replace the custom element with that HTML. But as soon as you introduce either a `<script>` tag or a `<style>` tag to the component, WebC will, by default, leave the custom element in place in case you are using it in either your scripts or your styles. You can tell WebC to remove the custom element by adding [webc:nokeep](https://www.11ty.dev/docs/languages/webc/#webcnokeep) to the custom element.

### Asset bundling

When WebC processes your components and it finds `<style>` or `<script>` tags in them, it can extract those assets into bundles for you to use later. This allows you to collect your assets into a single `<style>` tag inside the page `<head>`, rather than leaving `<style>` tags strewn about your HTML. See the Eleventy docs on WebC for information on [how to include bundled assets in your final markup](https://www.11ty.dev/docs/languages/webc/#css-and-js-(bundler-mode)).

> By default, when using the Eleventy plugin for WebC, asset bundling is turned on. If you are [using WebC directly](https://github.com/11ty/webc/), however, bundling is off by default.

### Scoped styles

One concern you may have about this single file component approach is that the styles from one component may leak into another. In our `site-footer.webc` component, for example, we have styles that apply to all `<footer>` elements; if we use a `<footer>` in any other part of our site, it will pick up that padding.

A common solution to this problem with SFCs is to scope the styles using some computer-generated unique class name. WebC supports scoped styles via the `webc:scoped` attribute, which you add to your `<style>` tag.

To scope our footer styles to just the `<site-footer>` element, we can update our component definition like this:

```html
<style webc:scoped>
  :host {
    padding-block: 3rem;
    padding-inline: 1rem;
  }

  :host footer > p {
    font-family: fantasy;
  }
</style>
```

> **Did you know**: [`:host` is a native CSS feature](https://developer.mozilla.org/en-US/docs/Web/CSS/:host) that selects the shadow DOM root host of web components. WebC is using `:host` as a hook to insert the generated class name for scoped styles. If you use `:host` outside of scoped styles, it won’t be replaced, but it will still be valid CSS.

Here we’ve added the `webc:scoped` attribute to our `<style>` element, and introduced the `:host` pseudo-class to our selectors. WebC now knows to generate a unique class for `<site-footer>`, which will replace `:host` with a class selector matching this generated class name. The generated class will be shared across `<site-footer>` instances. So our HTML will end up looking something like:

```html
<site-footer class="blarglargl">
  <footer>
    <p>&copy; 2022 Yours Truly</p>
  </footer>
</site-footer>
```

And the styles will be:

```css
.blarglargl {
  padding-block: 3rem;
  padding-inline: 1rem;
}

.blarglargl footer > p {
  font-family: fantasy;
}
```

## Slots

WebC supports the use of `<slot></slot>` for inserting markup inside your components when they’re used. And as with templates and slots for web components, you can define multiple named slots; something that none of the template languages Eleventy currently supports can do.

To illustrate how this can be useful, let’s create a card component that needs to have a title, some media, and a brief description. We won’t concern ourselves with the CSS for this component, but let’s assume we’re doing some fancy things that require us to place the aformentione title, media, and description inside some wrappers. We can define `a-card.webc` like this:

```html
<!-- a-card.webc -->
<article class="card">
  <div class="card__container">
    <div class="card__media">
      <!-- Media will be inserted here -->
      <slot name="media"></slot>
    </div>
    <strong class="card__title">
      <!-- Title will be inserted here -->
      <slot name="title"></slot>
    </strong>
    <div class="card__body">
      <!-- Description will be inserted here -->
      <slot name="body"></slot>
    </div>
  </div>
</article>
```

When we use this card in our markup we place the title, media, and description as children of our custom element and give them the appropriate `slot` attribute.

```html
<a-card>
  <a href="#" slot="title">The Hypnotoad</a>
  <img src="hypnotoad.gif" slot="media">
  <p slot="body">All glory to the Hypnotoad~</p>
</a-card>
```

Notice that we can order our elements however we want. We don’t have to place the media above the title when we define the card, because they will get pulled into the appropriate order when they're slotted into the component.

> **Did you know:** Slots are also a native part of the web platform. You can use them along with `<template>` to achieve the same effect we get with WebC but in the browser — though, unlike with WebC, using templates and slots in the browser requires JavaScript. To learn more about templates and slots, check out Mozilla Developer Network’s article on [using templates and slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

## WebC for web components

Up to this point, we’ve been looking at how we can use WebC in Eleventy for the same kinds of tasks for which we’ve previously used one of Eleventy’s template languages. But the WebC README declares (emphasis mine):

> WebC is for Single File _Web Components_

So what does all of this have to do with web components? Well, we can use WebC single file components as a convenient way to write and include web components — with templates and shadow DOM — in our sites. As a simple example, suppose we want to implement a theme toggle on our site that allows visitors to choose a light or dark theme, or to use whichever matches their operating system. We’re implementing this as a web component because it relies on JavaScript to switch the theme. Without JavaScript, the buttons wouldn’t do anything, so we don’t want them to be visible unless JavaScript is available.

We’ll call our component `theme-select.webc`:

```html
<!-- theme-select.webc -->
<script>
  class ThemeSelect extends HTMLElement {
    connectedCallback() {
      const template = this.querySelector("template");

      // Swap out the template with its contents so they become visible
      template.replaceWith(template.content);
    }
  }

  customElements.define("theme-select", ThemeSelect);
</script>

<template>
  <button>Light</button>
  <button>System</button>
  <button>Dark</button>
</template>

<style>
  theme-select {
    /* ... */
  }
</style>
```

> The `connectedCallback` method is one of the lifecycle callbacks for custom elements. It runs whenever the element is connected to a document by appending it to another element in the document. You can learn more about these lifecycle callbacks and creating custom elements in the Mozilla Developer Network documents on [using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

Now we can put `<theme-select></theme-select>` somewhere in our site, and we’ll end up with the following in our rendered markup:

```html
<theme-select>
  <template>
    <button>Light</button>
    <button>System</button>
    <button>Dark</button>
  </template>
</theme-select>
```

On top of that, WebC will bundle up the styles and JavaScript needed for this component, which we can place in the `<head>` tag, or at the end of the `<body>` tag, or wherever we need them. Since the buttons are inside a `<template>` tag, they will remain invisible on the page until the custom element is registered by our JavaScript and the web component becomes defined, at which point the `connectedCallback` runs, and extracts the buttons from inside the `<template>` so that they become visible and usable.

Of course, you could also set up a Shadow DOM inside of your web component, if you wanted to, but you don’t have to.

> There are plans to allow you to [aggregate arbitrary HTML](https://github.com/11ty/webc/issues/36) from your WebC components the way that styles and scripts are aggregated. This would mean that you could include a `<template>` as part of your component and guarantee that in the final markup there was only one copy of the template regardless of how many instances of the component you placed on the page.

## Learn more about WebC

There’s a lot more to WebC than what we’ve covered so far. If you want to learn more, the Eleventy docs have a [section on WebC](https://www.11ty.dev/docs/languages/webc/) which covers how to set up WebC with Eleventy as well as a lot of what you’ll need to know to use WebC in general, and with Eleventy specifically. Additionally, the [WebC README in the GitHub repo](https://github.com/11ty/webc) contains documentation for WebC. And, finally, I’ve created a small website built with Eleventy and WebC at [11ty.webc.fun](https://11ty.webc.fun/) which contains little recipes for working with WebC, such as [how to use WebC layouts in Eleventy](https://11ty.webc.fun/recipes/webc-layouts-with-layout-chaining/). You can check out the recipes (there’s an RSS feed, too), or dig into the [code on GitHub](https://github.com/darthmall/11ty.webc.fun/) to see how I used WebC.

And if you have questions, the [Eleventy Discord](https://www.11ty.dev/blog/discord/) is a great place to bring them. We have a WebC tag in the support forum.
