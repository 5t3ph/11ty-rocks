---
title: "Filter Titles for RSS and Social Shares"
description: "Replace characters that are often stripped out of post titles by RSS readers and social network link embeds"
date: 2021-08-08
---

Sometimes, we want to use characters in our page titles that we can safely escape on our own sites, but which would be stripped out by social networks' link embeds or when pulled up in an RSS reader. For instance, an article called ["&lt;tfoot&gt;: The Table Foot element"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot) is usually stripped down to ": The Table Foot Element" to prevent cross-site scripting. If you use the [`&lt;` and `&gt;` HTML entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) instead, these same platforms will display your title as "\&lt;tfoot\&gt;: The Table Foot element," which is also not ideal.

You could choose to rework your titles so you don't run into this issue. Alternatively, you could automatically replace the offending characters with close lookalikes that won't be stripped out. Here, we'll replace the less-than and greater-than signs with the similar-looking `‹` and `›` [single guillemets](https://en.wikipedia.org/wiki/Guillemet).

> **Accessibility tip:** Replacing characters with other characters can pose accessibility concerns, as screen readers will attempt to pronounce the characters according to their intended purpose. As such, it's best to use this technique when you have no other option. Here, we're fine with replacing less-than and greater-than signs with guillemets because guillements are a kind of quotation mark, and most screen readers will treat them as just a brief pause, which is a better experience than not including the characters at all.

## Step 1: Creating the Filter

We'll create an [Eleventy filter](https://www.11ty.dev/docs/filters/) that will take a string (our post title) and replace characters with their lookalikes.

In your Eleventy config:

```js
eleventyConfig.addFilter('replaceStrippedCharacters', function(title) {
	return title
		.replace(/</g, '‹')
		.replace(/>/g, '›');
})
```

You can include any substitutions you need in this filter.

## Step 2: Filter Titles in Social Link Embeds

Go to your layout where you have your meta tags. You likely have a meta tag that looks like this:

{% raw %}
```html
<meta property="og:title" content="{{ title }}" />
```
{% endraw %}

Update this tag so that it passes your post's `title` through your new `replaceStrippedCharacters` filter:

{% raw %}
```html
<meta property="og:title" content="{{ title | replaceStrippedCharacters }}" />
```
{% endraw %}

Now whenever your link is shared on social media, the link embeds will display your character substitutions. You can validate this works using tools like [Twitter's card validator](https://cards-dev.twitter.com/validator).

## Step 3: Filter Titles in RSS Feeds

> **Note:** This section assumes you're using the official `eleventy-plugin-rss` plugin with the [recommended sample Atom feed template](https://www.11ty.dev/docs/plugins/rss/#sample-atom-feed-template) to generate your RSS feeds.

Find the RSS template file you created while setting up Eleventy's RSS plugin. This template file likely loops over a collection of posts, doing something like:

{% raw %}
```liquid
{%- for post in collections.posts %}
  {% set absolutePostUrl %}{{ post.url | url | absoluteUrl(metadata.url) }}{% endset %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}</content>
  </entry>
{%- endfor %}
```
{% endraw %}

Pass the `<entry>`'s `<title>` through the `replaceStrippedCharacters` filter:

{% raw %}
```liquid
{%- for post in collections.posts %}
  {% set absolutePostUrl %}{{ post.url | url | absoluteUrl(metadata.url) }}{% endset %}
  <entry>
    <title>{{ post.data.title | replaceStrippedCharacters }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}</content>
  </entry>
{%- endfor %}
```
{% endraw %}