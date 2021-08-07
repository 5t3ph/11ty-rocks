---
title: "Create Your First Basic 11ty Website"
description: "Begin from a blank directory and build up your first Eleventy site. Includes gotchas along the way, why they happen, and how to resolve them. You'll create essential layouts while learn the basics of using Nunjucks and Markdown for templating. And you'll learn to work with local data and external API data. As a bonus, get setup to deploy your final site to Netlify."
templateEngineOverride: md
date: 2020-10-31
---

The following tutorial is based on a live stream I did with [Eva on Twitch](https://www.twitch.tv/edieblu). If you prefer, you can watch the recording below, or read on for the step-by-step instructions for creating your first basic 11ty website.

<div class="tdbc-video"><iframe src="https://www.youtube.com/embed/2By887u7b0A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

> Check out [the final project on GitHub](https://github.com/5t3ph/11ty-basics), and [the deployed examply on Netlify](https://11ty-basics.netlify.app/).

## Begin the Project

Open a new directory in your editor of choice, and then in your terminal do the following command to start a brand new project:

`npm init -y`

Then, install Eleventy. For a basic site like this, eleventy itself is our _only_ dependency!

`npm install @11ty/eleventy`

Once the installs complete, open `package.json` and update the default `scripts` section to the following. This enables a `start` command to run 11ty with hot-reload, which is provided by Browsersync that comes bundled as part of 11ty's `--serve` directive.

```js
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
```

## Add Eleventy Config

Next, we want to begin our Eleventy config. This initial addition is completely optional, but we will be adding more items to this config later.

Create the file `.eleventy.js` at the root of the project.

Then, add the following as the contents.

```js
module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
```

The first change here is setting the `input` directory to `src` - as in, the directory 11ty will watch for changes and use to build for production. Then, we change the `output` directory to `public` which means that's where our production-ready files for use by `localhost` and a hosting server will be published.

### Create `.gitignore`

At this point, you may want to take a minute to setup your `.gitignore` if you will be using version control. At minimum, here are the contents for that:

```bash
# dependencies installed by npm
node_modules

# build artefacts
public
```

## Run the Develop Server

We have our base in place, so let's try to run the project using our `start` command:

`npm start`

And... oops! You will get an error message: "Cannot GET /". That's because 11ty will literally _only_ serve up what you give it. So, we first have to create an `index` file in our input directory, which we defined in `.eleventyconfig` would be called `src`.

### Create the Site Index File

So, perform the following steps:

1. Create `src/`
2. Create `src/index.md`

If you like, add some content into the Markdown file.

> Markdown is one of 11 available templating languages you can use to create your 11ty site. [Check out the other options >](https://www.11ty.dev/docs/languages/)

Then, refresh the browser page and you will see the content you just added or a blank page if you added no content.

However, Browsersync is not yet activating which is why you had to manually refresh. To understand why, trigger your browser's context menu to "View Source". As you'll see, there is no markup being rendered besides what's needed for the conversion of Markdown to HTML.

For Browsersync to run (and to keep inline with overall standards) we need to provide a way to generate what is often called the HTML5 boilerplate that includes `<html>`, `<head>`, and `<body>`. Once the rendered markup includes `<head>` then Browsersync will be injected and provide the hot-reload for future edits.

> **Troubleshooting tip** - if Browsersync isn't working, this is a good sign that you've forgotten to supply the HTML boilerplate.

## Create the `base` Layout

To resolve needing to provide the HTML5 boilerplate, we'll use 11ty's concept of _layouts_.

One of the expected 11ty directories is called `_includes` and it's where you can add layouts.

> You may also be familiar with the concept of templates, or template partials, and you may also place those in `_includes`.

A common 11ty convention is to create this essential HTML structure within `_includes/base.njk`.

If you are in a code editor that supports Emmet, you can use the command `html:5` to instantly populate it with the HTML5 boilerplate.

Then, we'll prepare this `base.njk` to start accepting some Frontmatter values that we will add to our content. First, we'll plan for a `title` value.

Since we've created this as a Nunjucks template file (`.njk`), we can use the double-curly format to access the `title` Frontmatter variable, like so: `{{ title }}`.

We'll add it to the `<title>` and create it as an `<h1>` within the `<body>`.

Finally, we need to designate where the body of the markdown file should go. This is available in the Eleventy global page variable of `content`. In order to allow rendering of any HTML tags from the page content, we also use the built-in filter called `safe` which is added after placing a pipe - `|` - character.

This makes our full `base.njk` the following, with a bit of extra HTML semantics:

```twig
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
</head>
<body>
  <header>
    <h1>{{ title }}</h1>
  </header>
  <main>
    {{ content | safe }}
  </main>
</body>
</html>
```

Then, we will go back to `index.md` and create frontmatter to designate the `title` and also to designate the `layout` value so that this page uses our `base.njk` template:

```md
---
title: My first page
layout: base.njk
---
```

You will have to manually refresh the page one last time so that it loads the updated markup. Then, additional edits will begin to be picked up by Browsersync. You can test this by modifying the value for the `title`.

## Create the Blog

Next, we'll create a new content type for our blog. To do this, we'll create a new directory and a markdown file for our first post.

1. Create `src/blog/`
2. Create `src/blog/my-first-post.md`

### Create the `post` Layout

Next, we'll create a dedicated layout to display our blog posts.

Back in the `_includes` directory, create `post.njk` with the following content:

```html
<article>{{ content | safe}}</article>
```

### Chain the `post` Layout to the `blog` Layout

We'll then use an Eleventy concept called "layout chaining". This will allow us to designate that the `post` layout should also inherit the `base` layout.

To do this, in `post.njk` add the following frontmatter:

```md
---
layout: base.njk
---
```

At this point, you can try to visit the blog page in the browser. By default, 11ty will have created the page using the same structure as you used to organize it in your `src` directory. In other words, it will be located at `http://localhost:8080/blog/my-first-post/`.

However if you visit that, you should find that it's blank! Read on to learn why.

### Create `blog` Directory Data File

The first reason that link shows a blank page is that we haven't designated that our new blog post should use the `post` layout.

Now, we could add this as frontmatter to every post as we've already learned about. But when you plan on having many files in the same directory inherit certain attributes such as the layout, we can instead create a _directory data file_.

The directory data file is expected to have the same name as the directory, and be formatted as JSON. So, create `src/blog/blog.json` and add the following:

```js
{
  "layout": "post"
}
```

At this point, you may still see a blank page if you have not added any content into the blog post 😉 The other part we haven't added that our `base` template expects is frontmatter for the `title`, so go ahead and add that now based on what we've learned.

Once you've added both a title and some content, on save you should nearly instantly see Browsersync update the page and see that content rendered.

### Optional: Modify the Blog Post Permalinks

One other way we can use our data directory file is to set an altered permalink structure. "Permalink" is the term for the URL path that follows your domain (maybe you've also heard this called a "slug").

Just as an example, let's use the 11ty supplied page variable of `fileSlug` and tell 11ty to drop the `blog/` from the front of the URL and just use the file name as the permalink value. Here is the update ot our `src/blog/blog.json` file:

```js
{
  "layout": "post",
  "permalink": "/{{ page.fileSlug }}/"
}
```

So, our previous blog page is now available at `http://localhost:8080/my-first-post/`.

> **Note**: You will continue to be able to visit the old URL because it is currently cached in the `public` directory. You can delete the `public` directory to remove it, because that directory is completely rebuilt after each save when 11ty is in `watch` mode.

## Create `posts` Collection Via `tags`

Next, we'll explore an 11ty idea called [collections](https://www.11ty.dev/docs/collections/). Collections are groups of related content created by adding `tags`.

We'll again make use of our directory data file and add a new key of `tags` with the value `posts`:

```js
{
  "layout": "post",
  "permalink": "/{{ page.fileSlug }}/",
  "tags": "posts"
}
```

And with that, 11ty will now have created a collection called "posts" which we'll learn how to display next!

> Before you move on, it would be useful to create a second blog post to help see the effects of our next few steps on affecting the `posts` collection. You can simply duplicate the first post and change the file name and the `title` frontmatter value.

## Display `posts` Collection on Home Page

Often it is nice to display a list of your posts. Some times that's on the home page, and sometimes on an archive page. We will be adding it to our home page as a starting point, but you can customize this to display on any page.

Re-open `index.md` and add the following, then we'll review what's happening:

```twig
## Blog Posts

{% for post in collections.posts %}
{{ post.data.title }}
{% endfor %}
```

If you're wondering what those curly braces and percent signs are about, what we've done is created a _for loop_ using the [Liquid templating language](https://shopify.github.io/liquid/) (which happens to share this basic curly brace syntax with [Nunjucks templating language](https://mozilla.github.io/nunjucks/)).

We've defined a local variable of `post` to be the reference to an individual item in `collections.posts`. Thanks to adding our tag of `posts`, this collection was created by 11ty and is available throughout all site files.

Within the loop, we are simply retrieving the post's title, which is nested within `data` due to it being a frontmatter value.

> Notice that the loop start and end uses the syntax of a single curly brace and a percent sign, while the portion retrieving the frontmatter variable is flanked by two curly braces. For both Liquid and Nunjucks templating, `{% %}` contains functions and `{{ }}` displays variables.

### Create Linked List of Posts

We can modify our `for` loop to use semantic HTML and create a list of links to each post.

We've added one new variable, which is `url`. This is a page variable provided by 11ty for any paged piece of content, and so is available directly off of our local loop variable of `post`:

```twig
<ul>
{% for post in collections.posts %}
<li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
```

> Have you realized we're doing all of this is a markdown file so far? That's right - we've mixed markdown, HTML, and Liquid and still had success rendering our outcome! This is part of the ✨ magic of 11ty!

<small>If the previous example broke, it may be because you added spaces or tabs to indent and format the HTML - that's a pitfall of trying to mix templating languages which we'll sort out next!</small>

## Create Template Include from Blog Post Links

Ok, while we _can_ do all of this in markdown, it's not sustainable for all types of content - or, as noted, breaks when trying to add formatting to the HTML (read why [on the 11ty docs](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output)).

Let's improve our solution, first by creating a _template include_ (or "partial") to hold our post list. Includes will live in our - you guessed it! - `_includes` directory.

Create `_includes/postlist.njk`, and move the HTML with the `for` loop into it, removing it from the index.

In it's place in `index.md`, add `{% include "postlist.njk" %}` and save.

Oops! We've hit an error which should be visible in your Terminal. Let's find out why...

## Instruct 11ty How to Handle Template Processing

While we can do some template mixing, sometimes 11ty needs a little hint on our expectations of how to process the mix.

In the case of mixing templating with markdown, 11ty _only_ allows either Liquid or Nunjucks.

What happened to cause our error had to do with order of operations, and in this case we need to add an 11ty-supplied frontmatter key to tell 11ty which order to process the templating vs. the markdown.

Add `templateEngineOverride: njk,md` to `index.md` frontmatter, which says to process the Nunjucks include _first_ and then continue processing the markdown to render.

Hooray! The error is resolved, and we can again see our postlist being rendered on the home page.

## Create a CSS File

One big thing missing from our site is some style 😎

CSS is not yet a file type recognized for auto-inclusion in the build directory, so we need to do a few extra steps.

First, let's create a very basic starting point for our CSS.

Create `src/css/style.css`, and add:

```css
body {
  font-family: sans-serif;
}
```

### Passthrough CSS

In order for 11ty to recognize our CSS file and include it in the build directory, we need to modify `.eleventy.js`.

As the first line inside of the `module.exports` function (before the `return` we had previously added), add:

```js
eleventyConfig.addPassthroughCopy("./src/css");
```

This tells 11ty to "pass through" the CSS directory.

### Watch CSS for Changes

In addition to the pass through, we also need to ask 11ty to watch the CSS directory for changes so that when we modify our CSS file it triggers a rebuild and refresh from Browsersync.

Still in `.eleventy.js`, add the following after our pass through line:

```js
eleventyConfig.addWatchTarget("./src/css/");
```

> When changes are made to `.eleventy.js`, it typically requires stopping the watch process and restarting. On both Mac and PC, use `Ctrl + C` in Terminal to stop the watch command, and then re-run `npm start` to start it again. When complete, the CSS directory should be present in `public` and if you test modifying `style.css` the changes should cause a rebuild and be updated in `public/css/style.css`.

## Link to Stylesheet in `base` Layout

Now, our CSS hasn't updated our site to a `sans-serif` font yet. Any guesses why?

Yup - we need to add the stylesheet link to our layout!

Within `_includes/base.njk`, add the following within the `<head>` section after the `<title>`:

```html
<link rel="stylesheet" href="/css/style.css" />
```

And on save, once Browsersync refreshes, the page content should be using a `sans-serif` font.

> 🏁 **Checkpoint**: You have now created a successful 11ty starting point! Using what you've learned so far, you can continue making different content types and organizing them into collections. You know how to modify their permalinks, and chain layouts. And you know how to use Liquid and Nunjucks to display variables and leverage `for` loops. You can also mix templating languages and overcome templating pitfalls. And you can add and watch a CSS file. The last few sections show a bit more advanced features of 11ty that will help you take your project further!

## Custom Data

One of my favorite features of 11ty is custom data. One of the expected directories in the 11ty file system is `_data`, and any files you create here that are `module.exports` or basic JSON data is made availably _globally_ to your pages and layouts.

So, let's create a simple (and silly) data file: `src/_data/facts.json`

```json
[
  "Did you know horses can swim?",
  "Did you know that the average human can hold their breath for 2 minutes?",
  "Did you know that we live on Earth?"
]
```

<small><em>These are definitely true facts...maybe...</em></small>

### Add `facts` Loop to `post` Layout

For fun, let's add our facts after our blog post content.

Add the following after `article` in `_includes/post.njk`:

```twig
<aside>
  {% for fact in facts %}
    <p>{{ fact }}</p>
  {% endfor %}
</aside>
```

This for loop should look pretty familiar, but instead of retrieving data from a _collection_ we are requesting it from our _facts_. Recall that I mentioned that the output of files in `_data` is made globally available? This means that we can access the output of that data by referencing the _filename_, which is where `facts` comes from.

If you visit one of your blog posts, you should see each fact is output within a paragraph tag.

## Create `randomItem` Filter

Now, it's not very interesting to output all of our facts at once.

Let's add our first custom filter to help randomly pick one of the facts to display.

Open `.eleventy.js`, and add the following between the work related to our CSS, and the `return`:

```js
eleventyConfig.addFilter("randomItem", (arr) => {
  arr.sort(() => {
    return 0.5 - Math.random();
  });
  return arr.slice(0, 1);
});
```

`addFilter` globally makes the "randomItem" filter available to any templating language. In this case, we expect that the data that will come into the filter will be an array, since we'll be using it on our `facts` array. The body of the filter is a very basic randomizing function written in JavaScript.

### Add the Filter to `facts` Loop

Back in our `post` layout, we'll update our `for` loop to include our filter. If you recall from applying the `safe` filter, a filter goes _after_ the variable or collection it is being applied to, with a pipe `|` character inbetween. The `facts` array is passed into the filter for processing.

```twig
{% for fact in facts | randomItem %}
```

On save, there should only be one randomly selected fact displayed on each blog post. Of course, there's a chance that the fact will be the same since it's a small pool to choose from ☺️

> **Important note**: Since 11ty is a truly _static_ site builder, the quote will be selected during _build time_ and not on _page load_. This is an important difference from dynamic build tools like Gatsby. You can include JavaScript on your own to make this selection happen on page load, but using the filter method makes it part of the build process. If you have content that you want to update somewhere between statically and page load, you can use tools like IFTTT to trigger periodic builds if your site host supports webhooks.

## Create Data from API

11ty can use the output of Node modules as data, which also means we can use Node packages to help us retrieve data. And it means we can get external data at build time.

Let's explore this by retrieving a cat picture from an API using axios for fetching.

Create `_data/catpic.js`, and add the following:

```js
const axios = require("axios");

module.exports = async () => {
  const result = await axios.get("https://aws.random.cat/meow");

  return result.data.file;
};
```

<small><em>Note: You may need to add `axios` to your package for a local build to work: `npm install axios`</em></small>

It's ok if you're not very familiar with Node! What we're doing here is _fetching_ the result from the cat pic API. Then we are returning the `file` key that is present in that particular data set.

### Add `catpic` to Home Page

Now we'd like to display the retrieved cat pic on our home page. Add the following to `index.md`:

```twig
## Cat of the Day

<img src="{{ catpic }}" />
```

Since the API includes an image URL within the `file` key, and we are directly returning that value out of our function within `_data/catpic.js`, and 11ty has made that output available globally via the filename - this makes including it in our image tag very simple!

Once again, remember that this fetch only happens at build time. Meaning, once your site is built on your hosting server, whatever cat pic is retrieved will be what is displayed until the next site build. However, for the duration that you are doing local development with `npm start`, a _new_ build is generated each time you save a file, which will make it appear as though the `catpic` is changing more frequently.

> 🏁 **Checkpoint**: Congrats! You now know how to add local and external data to your 11ty site! With these fundamental concepts, you can really stretch 11ty to many use cases. To wrap up, read on to learn how to deploy to Netlify, or feel free to use the host of your choice.

## Bonus: Deploy to Netlify

Netlify is an excellent host for static sites - especially because you can start and stay free for basic needs.

### Create a Netlify Config

If you choose to continue with hosting on Netlify, we can create a file to speed up your first deploy.

At the root of your project (outside of `src`), create `netlify.toml` with the following content:

```yaml
[build]
  # Directory (relative to root of your repo) that contains the deploy-ready
  # HTML files and assets generated by the build. If a base directory has
  # been specified, include it in the publish directory path.
  publish = "public"

  # Default build command.
  command = "npm run build"
```

This is telling Netlify that our production-ready files post-11ty build will be located in `public/` and that the command to produce that build is `npm run build`.

### Push to Github

Netlify runs off of a continuous integration model, which allows any pushes to your main branch on Github to trigger a build.

> Alternatively, you can [drag and drop your site folder](https://app.netlify.com/drop) to deploy!

For the GitHub route, create a repo and push your project to Github (_instructions outside the scope of these steps_).

### Connect to Netlify and Deploy

After pushing to GitHub, follow these steps, after which your new site will be live immediately at a temporary URL provided by Netlify!

1. Create a [Netlify](https://netlify.com) account, using GitHub login for fastest deploy
1. Select "Create from Git"
1. Link to Github and select your repo
1. Netlify will recognize the values in `netlify.toml` and you can deploy! 🎉

> **Next Steps**: For a video walkthrough and slightly different way to get started with 11ty, including adding Sass for styling, check out my 20 minute egghead course: [Build an Eleventy Site From Scratch](https://5t3ph.dev/learn-11ty)
