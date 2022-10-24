---
title: "Understanding WebC Features and Concepts"
description: "WebC is an exciting addition to the 11ty ecosystem as it enables first-class components. Putting the pieces together may be a little overwhelming, so let’s review some WebC features to help you be successful!"
date: 2022-10-24
---

> If you haven’t yet heard of WebC, check out another 11ty Rocks article, [Introduction to WebC](/posts/introduction-webc).

## Including WebC components outside of `.webc` templates

One option for using WebC is to go all in and start defining your templates using the `.webc` extension. If you do that, you’ll also get access to any components you define due to already being within a WebC context.

For myself, I want to use my WebC components within other templates that I already have. Typically, I favor Nunjucks and Markdown for my 11ty projects.

One way to make WebC components available to other template types is by listing the path under the `components` option for the WebC plugin (aka “[global no-import components](https://www.11ty.dev/docs/languages/webc/#defining-components)”). The gotcha here is when you have also customized your 11ty `input` directory to something besides the default of the project root.

The `components` path is _root-relative_ as opposed to _input directory relative_, which means that if you customize the `input` directory, you’ll need to include that in the path update.

I like to [customize the `input` directory](https://www.11ty.dev/docs/config/#input-directory) to `src`, which makes the following my path when following the recommendation to put the `components` directory inside the `_includes` directory.

```js
eleventyConfig.addPlugin(pluginWebc, {
  components: "src/_includes/components/**/*.webc",
});
```

> **Extra gotcha**: If you try to place your `components` directory outside the `_includes` directory, you’ll have to resolve ignoring it during 11ty’s build process, which is already handled if you stick with placing it in `_includes`. Otherwise, your components will build out as extra pages which is not the behavior you want!

You’ll also need to [include the Render plugin](https://www.11ty.dev/docs/languages/webc/#use-the-render-plugin) to process your WebC components outside of `.webc` templates, which supports Liquid, Nunjucks, and 11ty.js.

The Render plugin is included with 11ty but is opt-in, so here are the changes to make to your config:

```js
// .eleventy.js
const { EleventyRenderPlugin } = require("@11ty/eleventy");

// Add the plugin within your existing module export
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
};
```

Then you can use the Render plugin to wrap your WebC component when outside of a `.webc` template.

```twig
// Nunjucks
{%- raw %}
{% renderTemplate "webc" %}
<my-custom-component></my-custom-component>
{% endrenderTemplate %}
{% endraw %}
```

> Unfortunately, using the Render plugin to try to render your WebC components in markdown will not be successful. I’ve [created an issue](https://github.com/11ty/eleventy/issues/2607) to hopefully work this out for folks like myself who write blog posts with markdown.

## Static HTML WebC rendering vs. web component rendering

Since WebC is very new, a misconception I had was that it created “real” web components in all instances. As it turns out, using WebC for native web component rendering is not the primary concern and entirely up to you as the author.

### WebC for static HTML

WebC promotes the use of static HTML and can be used as a way to include HTML that has awareness of the Eleventy data cascade. This makes WebC an alternative to methods like Nunjucks includes or macros, or Eleventy shortcodes.

When using WebC for static HTML components, the outer wrapper - for example, `<my-component>` - is removed in the final rendering.

Once you include a `style` or `script` block in your WebC component, it is treated as a custom element. By default the outer wrapper - aka the “host component” - is retained, which is the first difference from HTML-only WebC components. A unique aspect of how WebC handles this rendering is that you can overload _any_ existing element, such as `blockquote` or `img`.

> If you’re interested in how WebC handles scripts and styles, learn about [WebC asset bundling](https://www.11ty.dev/docs/languages/webc/#asset-bundling) in the docs.

Up until the point you register a web component, you still have a static HTML WebC component. This means you can still leverage scoped styles and co-locate your scripts and take advantage of the WebC format without the jump to a "real" web component.

### WebC for web components

So, what if you want a _real_ web component? If you have low experience with creating them, a gotcha may be that in order to register a native web component, it needs to have a hyphenated name like `super-slider` and not just `slider`.

You’ll also need to ensure that when you place the `script` tag for the asset bundle that it includes the attribute `type="module"` or the browser will prevent it registering correctly.

> It should be noted that WebC becomes the manager for scripts and styles but the native web component behavior described doesn’t strictly require WebC.

11ty’s creator, Zach Leatherman, is positioning WebC as a convenience for building progressively enhanced components that work when Javascript is not available. One method that may be appropriate if your component relies on JS to work is to wrap your WebC content with the native HTML `template` element. This will prevent the contents rendering immediately to the page. Then, by registering your web component, which happens with JS, you can reveal the `template` contents.

> Evan shows this [pattern of using `template`](/posts/introduction-webc/#webc-for-web-components) in the `theme-select` example from the 11ty Rocks’ article Introduction to WebC.

We'll review a bit more advanced use of `template` in the last section.

## Styling for custom elements and web components

It may surprise you (as it did me!) to see that styles are applied to custom elements without a shadow DOM. This includes affecting what renders after the `template` content becomes visible using the method described.

You can use two native CSS selectors to distinguish between the states of before and after the component is registered, which is especially useful if not all your component elements are wrapped up in `template`.

- `:host` - refers to the parent custom element/web component
- `:host:defined` - the “defined” state is true after a web component is registered, which effectively also means when JS is available

For general use of `:host` outside of a shadow DOM, within WebC you’ll also need to set `webc:scoped` on `style`. WebC will then hijack `:host` to generate a hashed class for “scoping” the styles you define to your custom element.

This WebC concept means you can use `:host` when you’ve defined a custom element that isn’t registered to become a web component to benefit from scoping.

Alternatively, you can apply classes within your `.webc` component or per instance and use styles from your stylesheet and any framework. WebC will merge classes as necessary and will apply the classes to the outer custom element.

## Data within WebC components

There are three main ways to render data passed into your WebC component:

- `@html` allows rendering the attribute as the HTML content
- dynamic attributes are created be prepending an HTML attribute with a colon, like `:att` and filling it with the corresponding attribute from the host component
- slots, which we’ll discuss in the next section

Both `@html` and dynamic attributes allow rendering of attributes/props passed to the host component. The following shows how to use each for a form field component.

```html
<!-- page.webc -->
<form-field label="Name" type="text" value="Stephanie"></form-field>

<!-- form-field.webc -->
<label @html="label"></label>
<input :type="type" :value="value" />
```

### Unique values using `uid`

An (as yet) undocumented feature of the WebC plugin is the attribute `uid` which generates a unique string per instance. We can use this to enhance our `form-field` component to ensure each field has a unique `id` and semantically using that as the value of the label `for` as well.

```html
<!-- form-field.webc -->
<label @html="label" :for="uid"></label>
<input :type="type" :value="value" :id="uid" />

<!-- renders to: -->
<label for="webc-97Lq2">Name</label>
<input type="text" value="Stephanie" id="webc-97Lq2" />
```

### Concatenating strings

Keeping with our `form-field`, perhaps we want to enable a field description. For accessibility we should tie that to the field with `aria-describedby`. We can concatenate an extra string with the `uid` to create the `id` for that relationship:

```html
<input :type="type" :value="value" :id="uid" :aria-describedby="'desc-' + uid" />
<p :id="'desc-' + uid" @html="description"></p>
```

This JS-flavored syntax for concatenating works for any dynamic attribute, as well as populating the `@html` value. Alternatively, you can use template literal strings, such as `` :id="`desc-${uid}`" ``.

### Privatising attributes

So far, this example is static HTML so WebC strips the custom element from the final render. If we add some scoped style, the custom element is retained. Additionally, the attributes we passed in are also retained as attributes on the custom element and are visible in the browser:

```html
<!-- rendered source -->
<form-field
  label="Name"
  type="text"
  value="Stephanie"
  description="Your first name please"
  class="wjuym-vnb"
></form-field>
```

To remove those from continuing to be part of the custom element, with WebC we can make them “private” when including the component. This is done by prepending each attribute with `@`, such as `@label`, which turns it into a property (aka prop). In our `form-field` example, this means all attributes will be removed from the final render except the `class`.

### Removing unnecessary elements

If we consider a secondary component for radios and checkboxes, maybe we want the label to wrap the input. This poses what may seem like a problem in that we need to still render the label value, which we’ve learned is done via `@html` and means we need to add an element to attach that too. You might be inclined to use a `span` as follows:

```html
<label :for="uid">
  <input :type="type" :id="uid" />
  <span @html="label"></span>
</label>
```

A `span` is semantically ok, but if you do not _need_ it for styling purposes, then you can attach the attribute `webc:nokeep` which will discard the `span` upon render.

Since you’re discarding the element, you can choose something else even completely made-up as long as you haven’t assigned it to another WebC component. For example, simply `x`:

```html
<x @html="label" webc:nokeep></x>
```

## Advanced patterns with slots

Attributes and props fit a lot of use cases, but to enable a bit more flexibility in structuring your components you can use slots. Evan already covered [using slots for a static HTML `card` component](/posts/introduction-webc/#slots) in the intro article, so we’ll look at two other patterns.

First, we can break up large components and use slots to fit them together thanks to WebC rendering.

If we create a `form-submit` component separate from the `form-field` and `form-input` then we can use slots to help structure the component. We’ll have a single slot called `fields` which can be populated per instance. This allows freeform flexibility for how the form fields are created and ordered.

```html
<!-- form-submit.webc -->
<form>
  <slot name="fields"></slot>
  <button type="submit">Submit</button>
</form>

<!-- turn it into a full web component to handle validation
and submission logic -->
```

Then, we assign to fields to the slot by referencing the name of `fields` in the `slot` attribute. Also note the use of `webc:nokeep` which is optional but may be preferred.

```html
<!-- page.webc -->
<form-submit>
  <div slot="fields" webc:nokeep>
    <form-field label="Name" type="text" value="Stephanie" description="Your first name please"></form-field>

    <fieldset>
      <form-input label="Blue" type="radio" name="fav-color"></form-input>
      <form-input label="Red" type="radio" name="fav-color"></form-input>
      <form-input label="Green" type="radio" name="fav-color"></form-input>
    </fieldset>
  </div>
</form-submit>
```

The result is that WebC will statically render the individual fields within the form.

If your form requires JS, like a POST request to submit a newsletter form, then you may want to introduce the `template` pattern. Let’s setup up a form that also uses slots to represent optional fields. A neat feature of slots is if they are not given content, they are removed from rendering.

```html
<!-- subscription-form.webc -->
<template>
  <form>
    <slot name="name"></slot>
    <slot name="email"></slot>
    <slot name="business"></slot>
  </form>
</template>

<script>
  class SubscriptionForm extends HTMLElement {
    connectedCallback() {
      const template = this.querySelector("template");

      // Swap out the template with its contents so they become visible
      template.replaceWith(template.content);
    }
  }

  window.customElements.define("subscription-form", SubscriptionForm);
</script>
```

And then to use it, we’ll reference our `<form-field>` component and directly assign those to a slot:

```html
<!-- page.webc -->
<subscription-form>
  <form-field slot="name" @label="Name" @type="text"></form-field>
  <form-field slot="email" @label="Email" @type="email"></form-field>
</subscription-form>
```

> Note that we can’t make `slot` a private prop with `@` or it will fail to be assigned, so you will still see this attribute on the final render.

But - oh no! The slots haven’t been passed along correctly and aren’t rendering in the browser:

```html
<!-- rendered source -->
<subscription-form>
  <template>
    <form>
      <slot name="name"></slot>
      <slot name="email"></slot>
      <slot name="business"></slot>
    </form>
  </template>
</subscription-form>
```

When you try to use slots within `template`, and your intent is to allow WebC to process those for rendering, you’ll need a couple extra attributes on `template`. Otherwise, WebC will default to keeping the slots exposed for client-side things within your web component.

The adjustments are to add both `webc:keep` and `webc:type="11ty"` to the `template`. Use of `webc:type="11ty"` indicates that WebC should process the slots. And typically that would also wipe away the `template` so we need `webc:keep` added to keep it for the web component registration script.

```html
<!-- adjustment in subscription-form.webc-->
<template webc:keep webc:type="11ty"></template>
```

Now the `subscription-form` not only renders but there is no error from not including the “business” slot, and no empty placeholder for it either:

```html
<!-- updated rendered source -->
<subscription-form>
  <template>
    <form>
      <form-field slot="name" class="wjuym-vnb"> ... </form-field>
      <form-field slot="email" class="wjuym-vnb"> ... </form-field>
    </form>
  </template>
</subscription-form>
```

The composable nature of slots and how they can be processed at build-time rather than another piece for the client-side to handle makes this a strong contender against other Eleventy component patterns!

---

Have you created a WebC resource? Be sure to add it to the [community resources](/community/) or the [11ty Rocks webring](https://github.com/5t3ph/11ty-rocks/blob/main/join-webring.md)!
