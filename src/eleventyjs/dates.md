---
title: "11ty Date Shortcodes and Filters"
description: "Use this shortcode and filter as a starting point for your date transformation needs."
date: 2020-11-23
---

## `year` Shortcode

Get the current year - super useful for copyright dates.

**Usage**: {% raw %}`{% year %}`{% endraw %}

```js
eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
```

## `postDate` Filter

Eleventy uses [Luxon](https://moment.github.io/luxon/) for dates, which is a lighter weight alternative to Moment (but made by Moment).

By importing `DateTime` from `luxon` you are provided a deep toolbox of date methods.

Since this is a filter, and you'll likely use it to pass {% raw %}`{{ page.date | postDate }}`{% endraw %}, the format at that point is, ex: `(Sun Dec 31 2017 18:00:00 GMT-0600 (Central Standard Time)` which to Luxon is the `JSDate` format.

In the filter, the "zone" is importantly set to `UTC` to prevent off-by-one date errors.

The output as shown will be `Nov 23, 2020`, or you can update it to another option [referenced in the Luxon docs on DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html).

```js
// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");

eleventyConfig.addFilter("postDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj, {
    zone: "UTC",
  }).toLocaleString(DateTime.DATE_MED);
});
```
