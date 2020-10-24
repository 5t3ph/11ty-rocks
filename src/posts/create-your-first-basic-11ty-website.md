---
title: "Create Your First Basic 11ty Website"
templateEngineOverride: md
---

The following tutorial is based on a live stream I did with [Eva on Twitch](https://www.twitch.tv/edieblu). If you prefer, you can watch the recording below, or read on for the step-by-step instructions for creating your first basic 11ty website.

<div class="tdbc-video"><iframe src="https://www.youtube.com/embed/2By887u7b0A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

## Begin the Project

Open a new directory in your editor of choice, and then in your terminal do the following command to start a brand new project:

`npm init -y`

Then, install Eleventy. For a basic site like this, eleventy itself is our _only_ dependency!

`npm install @11ty/eleventy`

Once the installs complete, open `package.json` and update the default `scripts` section to the following. This enables a `start` command to run 11ty with hot-reload, which is provided by Browsersync that comes bundled as part of 11ty's `--serve` directive.

```js
  "scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
  },
```

## Add Eleventy Config

Next, we want to begin our Eleventy config. This step is completely optional.

Create the file `.eleventy.js` at the root of the project.

Then, add the following as the contents. The first change here is setting the `input` directory to `src` - as in, the directory 11ty will watch for changes and use to build for production. Then, we change the `output` directory to `public` which means that's where our production-ready files for use by `localhost` and a hosting server will be published.

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

If you are in a browser that supports Emmet, you can then use the command `html:5` to instantly populate it with the HTML5 boilerplate.

Then, we'll prepare this `base.njk` to start accepting some Frontmatter values that we will add to our content. First, we'll plan for a `title` value.

Since we've created this as a Nunjucks template file (`.njk`), we can use the double-curly format to access the `title` Frontmatter variable, like so: `{{ title }}`.

We'll add it to the `title` and create it as an `h1` within the `body`, making our full `base.njk` the following:

```md
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
</head>
<body>
  <main>
    <h1>{{ title }}</h1>
  </main>
</body>
</html>
```

Then, we will go back to `index.md` and create Frontmatter to designate the `title` and also to designate the `layout` value so that this page uses our `base.njk` template:

```md
---
title: My first page
layout: base.njk
---
```

You will have to manually refresh the page one last time so that it loads the updated markup. Then, additional edits will begin to be picked up by Browsersync. You can test this by modifying the value for the `title`.

## Create the Blog

Create `blog/`
Create `blog/my-first-post.md`

## Create the `post` Layout

Create `_includes/post.js`

Content:

```html
<article>{{ content | safe}}</article>
```

## Chain the `post` Layout to the `blog` Layout

In `post.js` add frontmatter:

```md
---
layout: base.js
---
```

## Create `blog` Directory Data File

Create `blog/blog.json`

```js
{
  "layout": "post"
}
```

## Modify the Blog Post Permalinks

```js
{
  "layout": "post",
  "permalink": "/{{ page.fileSlug }}/"
}
```

## Create `posts` Collection Via `tags`

```js
{
  "layout": "post",
  "permalink": "/{{ page.fileSlug }}/",
  "tags": "posts"
}
```

## Display `posts` Collection on Home Page

Add to `index.md`:

```md
## Blog Posts

{% for post in collections.posts %}
{{ post.data.title }}
{% endfor %}
```

## Create Linked List of Posts

Modify previous `for` loop:

```md
<ul>
{% for post in collections.posts %}
<li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul>
```

## Create Partial from Blog Post Links

Create `_includes/postlist.js`

Update `index.md` to use `{% include "postlist.js" %}`

## Instruct 11ty How to Handle Template Processing

Add `templateEngineOverride: js,md` to `index.md` frontmatter

## Create CSS File

Create `css/`

Create `css/style.css`:

```css
body {
  font-family: sans-serif;
}
```

## Passthrough CSS

Modify `.eleventy.js`:

```js
eleventyConfig.addPassthroughCopy("./src/css");
```

## Link to Stylesheet in `base` Layout

`<link rel="stylesheet" href="/css/style.css" />`

## Custom Data

Create `_data/`

Create `_data/facts.json`:

```json
[
  "Did you know horses can swim?",
  "Did you know that the average human can hold their breath for 2 minutes?",
  "Did you know that we live on Earth?"
]
```

## Add `facts` Loop to `post` Layout

Add after `article` in `_includes/post.js`:

```md
<aside>
{% for fact in facts %}
<p>{{ fact }}</p>
{% endfor %}
</aside>
```

## Create `randomItem` Filter

Add within the `module.exports` in `.eleventy.js`

```js
eleventyConfig.addFilter("randomItem", (arr) => {
  arr.sort(() => {
    return 0.5 - Math.random();
  });
  return arr.slice(0, 1);
});
```

## Add to `facts` Loop

```md
{% for fact in facts | randomItem %}
```

## Create Data from API

Create `_data/catpic.js`

_Note: You may need to add `axios` to your package for a local build to work: `npm install axios`_

```js
const axios = require("axios");

module.exports = async () => {
  const result = await axios.get("https://aws.random.cat/meow");

  return result.data.file;
};
```

## Add `catpic` to Home Page

Add to `index.md`:

```md
## Cat of the Day

<img src="{{ catpic }}" />
```

## Create `netlify.toml`

```yaml
[build]
  # Directory (relative to root of your repo) that contains the deploy-ready
  # HTML files and assets generated by the build. If a base directory has
  # been specified, include it in the publish directory path.
  publish = "public"

  # Default build command.
  command = "npm run build"
```

## Push to Github

Create a repo and push project to Github (_instructions outside the scope of these steps_).

## Deploy to Netlify

1. Create a [Netlify](https://netlify.com) account, use GitHub login for fastest deply
1. Select "Create from Git"
1. Link to Github and select your repo
1. Netlify will recognize the values in `netlify.toml` and you can deploy! 🎉
