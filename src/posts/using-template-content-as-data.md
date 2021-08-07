---
title: "Using Template Content as Data for 11ty"
description: "Create a collection of content using any Eleventy templating language and learn to control the output to enable using that content as data."
date: 2021-02-15
---

This tutorial describes a technique I've used in several of my 20+ Eleventy projects to push Eleventy to [exceed the traditional limits of static](/posts/going-beyond-static-with-eleventy/).

> **New to Eleventy?** Start with my [written tutorial](/posts/create-your-first-basic-11ty-website/) or [20 minute video course](https://5t3ph.dev/learn-11ty).

## Creating Content as Data

One way we can create data in Eleventy is via [the `_data` directory](https://www.11ty.dev/docs/data-global/), which is great for small arrays or for pulling in content from a CMS. Content contained in `_data` is then available for either [pagination](https://www.11ty.dev/docs/pagination/#paginate-a-global-or-local-data-file) or directly for uses such as looping to output content.

But what if your content will all be local and intended to output on a single page, and you would like to use templating or other rich features that would be cumbersome inside JSON? This is the type of scenario where you want to create "content as data."

## Step One: Create a Collection

Let's imagine our scenario is a site where we'll provide book reviews.

For ease of accessing our review content data, we'll create a collection.

In your input directory, create the `reviews` directory, and then inside of that create the file `reviews.json` which will be a [data directory file](/tips/data-directory-file/).

```json
{
  "tags": "reviews"
}
```

This is now creating the `reviews` collection by assigning it as a "tag" (the standard Eleventy way to create a collection) for all content that will live in this directory.

## Step Two: Prevent Page Generation

With only the previous step in place, if Eleventy is running and you add a file - such as `firstreview.md` - in the `reviews` directory, you will have `reviews/firstreview.html` created as a page in your site's output directory.

Since our intention is to use this content as data, we need to prevent this page generation.

Preventing generation of files in the site's `output` directory is handled by setting `permalink: false`, so we'll update our data directory file:

```json
{
  "tags": "reviews",
  "permalink": false
}
```

## Step Three: Create Collection Content

Now you can create files using any supported templating language within the `reviews` directory and take advantage of all the templating features it offers.

For example, here's a possible setup for our book review content type using Markdown:

```md
---
title: "Paddington Bear"
author: "Michael Bond"
rating: 4.5
buyLink: "/"
---

I enjoyed this book very much, and so did my 3 year old.
```

## Step Four: Output Collection Content

Once you have some content available, and since we've created it within a collection, we can now easily access it for output within a loop.

You may choose to create this loop within your index file, such as `index.njk`, or perhaps you would rather it be part of the layout that your index uses, such as `base.njk`.

> You can choose another templating language to loop over your content, but we're going to stick with Nunjucks for this example.

Our Nunjucks loop might then look as follows for accessing the book reviews:

{%raw-%}

```twig
{% for review in collections.reviews %}
  <article>
    <h2>
      <a href="{{ review.data.buyLink }}">{{ review.data.title }}</a>
    </h2>
    <ul>
      <li><strong>Author</strong>: {{ review.data.author }}</li>
      <li><strong>Rating</strong>: {{ review.data.rating }}/5</li>
    </ul>
    {{ review.templateContent | safe }}
  </article>
{% endfor %}
```

{%-endraw%}

Let's examine a few key aspects of that loop for successfully accessing and outputting the data as content:

1. Front matter values are accessed off of the `data` nested object
1. The compiled non-front matter content is available within `templateContent`
1. To ensure any HTML in the compiled template is rendered and not escaped (which would cause it to appear as additional text on the page), we also use the `safe` built-in filter
1. Avoid wrapping the `templateContent` within a paragraph since it arrives compiled and already includes HTML elements as appropriate

And with that you've successfully created and output content as data!

## Further Reading and Resources

Check out these related quick tips to extend this solution even more:

- [Changing Content Output](/tips/changing-content-output/)
- [Excluding Content Output](/tips/excluding-content-output/)
- [Managing Permalinks](/tips/permalinks/)

And checkout [this livestream I did with Colby Fayock](https://www.youtube.com/watch?v=nIiOwNb7KR4) where we use this same "content as data" idea when we start a site from scratch, but with a bit more templating features attached.
