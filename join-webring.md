# Join the 11ty Community Webring

> Originally constructed from my [11ty Web Component Generator](https://github.com/5t3ph/11ty-web-component-generator)

**To submit your site** as a community resource for possible inclusion in the 11ty webring, make a pull request to modify:

```
src/js/eleventy-webring.json
```

Add the title and link for your resource following the pattern of existing entries.

_No starters please_ unless they offer something super unique like [eleventy-create-site](https://github.com/bjankord/create-eleventy-site/). The webring is for general community resources like blogs, courses, and other community roundups. Starters are already listed [on the main 11ty docs](https://www.11ty.dev/docs/starter/).

Your link is subject to approval by myself (Stephanie Eckles).

## Add the 11ty Webring to your site!

The webring is a web component which you can add to your site in two simple steps!

First, add the following script tag:

```js
<script type="module" src="https://11ty.rocks/js/eleventy-webring.js"></script>
```

Then, place the web component where you'd like it to appear:

```html
<eleventy-webring></eleventy-webring>
```

### Customize with attributes

| Attribute | Type    | Description                                                                                                           |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| limit     | number  | Limit number of returned links                                                                                        |
| current   | string  | Match the title of your own resource to remove it from the list                                                       |
| random    | boolean | Optionally randomize the list order. Will be random on each load.                                                     |
| hideJoin  | boolean | Optionally hide the "Join" button. Provided as an option mostly if you want to completely customize the button style. |

**Example**: Limit to 3, exclude the current site, randomize, and hide the "Join" button:

```html
<eleventy-webring limit="3" current="11ty.Rocks" random="true" hideJoin="true"></eleventy-webring> ``
```

### Customize with CSS custom properties

You can customize quite a few styles by updating the custom property values. To do this, use `eleventy-webring` as an element selector:

```css
eleventy-webring {
  --eleventywr-font-size: 1.5rem;
  --eleventywr-title-font-family: "Open Sans", sans-serif;
  --eleventywr-link-color: rebeccapurple;
}
```

Available custom properies:

| Property                          | Attached to            |
| --------------------------------- | ---------------------- |
| --eleventywr-text-align           | .eleventywr (root div) |
| --eleventywr-text-color           | .eleventywr            |
| --eleventywr-font-family          | .eleventywr            |
| --eleventywr-font-size            | .eleventywr            |
| --eleventywr-title-color          | h2                     |
| --eleventywr-title-size           | h2                     |
| --eleventywr-title-font-family    | h2                     |
| --eleventywr-linkflex-justify     | ul                     |
| --eleventywr-link-color           | ul li a                |
| --eleventywr-button-bgcolor       | a.eleventywr-join      |
| --eleventywr-button-color         | a.eleventywr-join      |
| --eleventywr-button-padding       | a.eleventywr-join      |
| --eleventywr-button-border-radius | a.eleventywr-join      |
| --eleventywr-button-font-size     | a.eleventywr-join      |
| --eleventywr-button-color         | a.eleventywr-join      |
| --eleventywr-button-bgcolor       | a.eleventywr-join      |
