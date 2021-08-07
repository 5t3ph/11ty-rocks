---
title: "Going Beyond Static Sites With Eleventy"
description: "Eleventy includes features that allow exceeding the traditional limits of static. Learn how to leverage these features and think beyond static when using Eleventy."
templateEngineOverride: njk, md
date: 2021-01-28
---

{% set imgBase %}/img/beyond-static/{% endset %}

_The following is the written version of my talk at [TheJam.dev 2021](https://cfe.dev/events/the-jam-2021/)_

<div class="tdbc-video"><iframe src="https://slides.com/st3ph/going-beyond-static-with-eleventy/embed?token=s13kGbJt" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>

## Key Eleventy Features

### 100% Static Output

First, I was very drawn to it being able to be purely static. At it's most essential level, it can be a drop-in replacement for tools like Gulp, and can be built with good ole HTML and CSS.

A huge selling point for me was that there is zero boilerplate client-side JavaScript.

### Developer-Mode Conveniences

Eleventy includes BrowserSync when using the `--serve` flag which provides hot-reload as you make changes. There's also full console logging of what was changed or had errors, and the option to quiet this output.

### Minimal Opinions, Highly Configurable

Technically, the only requirement besides Eleventy is an `index` file which can be created in any of the languages. Mine is usually Markdown that feeds into a Nunjucks layout which we'll talk about in a bit.

Once you get a feel for how things work, you can begin to add your own opinions by updating the config, which is expected to be a root file called `.eleventy.js`

Here you can do things like customize your input and output directory, and add other watch directories. It's also the entry point for plugins, and where you'll hook in additional templating, data, and content features.

### 10 Templating Languages

With 10 templating languages available, an early realization was that I could re-purpose some of my organization preferences from both my React and WordPress days to create templates and components. I've grown a preference for a stack of HTML, Nunjucks, and Markdown.

The extra languages are a nice to have, and can be added in as you find a need for them.

### Templating Features

As I mentioned, my preferred stack with Eleventy is HTML, Nunjucks and Markdown. Here's the full list of currently available templating languages:

[![A gif of interacting with the template navigation on the 11ty docs]({{ imgBase }}11ty-langs.jpg)](https://www.11ty.dev/docs/languages/)

The first "a-ha" moment that made me really excited about Eleventy was the ability to mix templating languages.

This takes two primary forms:

- Mix in the same file (ex. Nunjucks and Markdown)
- Mix between layouts (Markdown file uses Nunjucks template)

Layouts are special templates that can be used to wrap other content. An example of this is having `index.md` contain your home page text content and Frontmatter for the page `title`, and have it point to the layout of `base.njk` which is an HTML5 boilerplate and uses template tags to display the `title` value and the Markdown content.

Eleventy also has a feature called layout chaining. So, you could create an `article` content type and a `news` content type that both chain to a `page` layout, and the `page` layout could chain to the `base` layout.

![Illustration showing the scenario described in the prior paragraph of the two content types using the page layout, and that using the base layout]({{ imgBase }}layout-chaining.jpg)

Within layouts and templates, you can use the syntax of the language you choose to include other files as partials. Or, you can create reusable content with shortcodes and manipulate content with filters. We don't quite have time to go through those features today, but the key point is that they allow even more customization and flexibility within your layouts and templates. You can review that info by visiting the [11ty docs on configuration](https://www.11ty.dev/docs/config/).

One of the most powerful features related to templating is being able to define overrides for the template engine which you can do _per file_ or in the Eleventy config*.*

On a per-file basis, we can place it in Frontmatter. Here we define that the template should be first consumed as Nunjucks, then Markdown. Eleventy will work for basic loops that mix languages, but adding filters or formatting can cause issues that the template engine override will resolve.

```md
---
templateEngineOverride: njk, md
---

## Featured Person

{% raw %}{% for name in people | randomPerson %}

- {{ name }}

{% endfor %}{% endraw %}
```

### Data

The example that was just shown actually was setup to use what Eleventy calls "custom data".

An optional directory can be included called `_data` and in there you can put things like JSON or JavaScript module exports. The name of the file is then made available throughout Eleventy to access that data. So in the "Featured Person" example, there is a file located in `_data/people.js` that exports a simple array, and we can then access that in any template by the filename of "people".

```js
module.exports = ["Mary", "Claire", "Steph", "Andy"];
```

But you're not restricted to flat or simple local data. You can also perform a fetch for external data and import any needed functionality to get and format the data you want Eleventy to use.

Here's a simple example fetching a path from a random cat picture API:

```js
const axios = require("axios");

module.exports = async () => {
  const result = await axios.get("https://aws.random.cat/meow");

  return result.data.file;
  // Ex: https:\/\/purr.objects-us-east-1.dream.io\/i\/image1-4.jpg
};
```

The important note here is that the fetch is done at build time, not client-side. For fetching from a CMS this is highly desireable. For content you want to keep more fresh, you can use services like IFTTT to do a periodic request if your site host provides webhooks to trigger a build. Of course, that is a static site limitation that is not unique to Eleventy.

We'll talk a bit more about data handling when we get to our examples.

### Content Management

A key feature for content in Eleventy is "collections". If you come from the WordPress world like I do, you can think of these similair to how adding tags creates sets of content. In fact, Eleventy uses the same convention of tags as one way to create a collection.

Tags can be added in Frontmatter, either as a single string or as an array.

But the slickest way is to create a directory data file. The directory data file needs to be named the same as the directory, and can be either JSON or JavaScript. It can hold any values that you would otherwise have to repeat in Frontmatter for all related content.

So in this example located in our `posts` directory, we create `posts.json` and define the tags as well as the layout:

```json
{
  "layout": "post.njk",
  "tags": "posts"
}
```

Now, we can access the `posts` collection within any of our templates:

```twig
{% raw %}{% for post in collections.post -%}
- [{{ post.data.title }}]({{ post.url }})
{% endfor %}{% endraw %}
```

## Feature Integration

As we saw with the data example that used axios for fetching, another benefit of Eleventy is that it is built with Node. And you can use anything in the Node and JavaScript ecosystem at build time.

Let's look a classic issue that is solved by having access to JavaScript at build time: making sure your footer has the correct copyright year.

In Eleventy, we could export this as data, but we can also create what is called a shortcode to be able to output it. This snippet actually comes direct from my [11ty.Rocks](/eleventyjs/dates/) config samples, and likely looks very familiar to those of you who frequently write JavaScript:

```js
eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
```

This snippet gets placed in the `.eleventy.js` config, and then you can use it in your templates.

There is also a fledging plugin ecosystem. Plugins come in as packages, and are included via the config as well. They range in complexity, but most provide access to shortcodes, filters, or other types of transforms that have the advantage of already being aware of how Eleventy works.

A bonus benefit in my journey with Eleventy was finally publishing a package since I wanted to release an Eleventy plugin, and now I have two:

[![Preview of my two plugins: @11tyrocks/eleventy-plugin-emoji-readtime and @11tyrocks/eleventy-plugin-social-images]({{ imgBase }}steph-11ty-plugins.jpg)](https://www.npmjs.com/search?q=%4011tyrocks)

The best way currently to discover all Eleventy plugins is to [search by the tag `eleventy-plugin` on npm](https://www.npmjs.com/search?q=eleventy-plugin).

### Flexible Output

I'm hoping you've heard a few things that have you interested in Eleventy, but this next feature is what opened the door to the examples I'll be sharing shortly.

By default, Eleventy works as you would expect from other similair static site generators. You create a file using whichever template language type and it ultimately outputs HTML.

But Eleventy, by way of defining permalinks, allows you to change the file type and place the resulting file anyway in the system.

A small example of this being useful is in creating the site's RSS feed, which is actually demonstrated by [the official Eleventy blog starter](https://github.com/11ty/eleventy-base-blog) and supported by an official plugin which provides some filters to assist in producing things like absolute URLs and correctly formatted dates.

[![Screenshot of the Eleventy base blog starter's RSS feed file]({{ imgBase }}11ty-rss.jpg)](https://github.com/11ty/eleventy-base-blog/blob/master/feed/feed.njk)

An additional way to use this feature is to be able to create a JSON file of page data that is actually constructed within a Nunjucks template and accesses an existing collection. The benefit of this is that you have the compiled template content available if say the page content itself was created in Markdown.

And using permalinks, we can both change it to be the `.json` file type but also place it outside of the src directory, thus excluding it from the site output but making it available for other processes.

![Illustration showing the scenario described in the prior paragraphs of markdown feeding into a Nunjucks layout that outputs JSON]({{ imgBase }}flexible-output.jpg)

What I've just described is how I was able to create a dynamic and synced data file that is used to create social media images. In that process, I kick the JSON file to a `functions` directory in which there is a Node Puppeteer script that loops through that data and loads it into an HTML template to take a snapshot and save the image.

## Community

Before we move on to examples, I wanted to note that despite Eleventy being just at three years old, there is an active, passionate community.

[Search the phrase "built with eleventy" on Twitter](https://twitter.com/search?q=%22built%20with%20eleventy%22&src=typed_query&f=live) and you'll get enthusiastic folx telling you all about it, often with a blog post about their experience.

Where some platforms have the concept of themes, Eleventy uses the term "starter" and there is [a growing collection to choose from](https://www.11ty.dev/docs/starter/). With 10 templating languages available, there are many opinions of how things should be done, so you're sure to find one to help get you off the ground.

The market for content about Eleventy is still young, which I find exciting and have personally embraced. But when you really can't find the answer, you can tag [the offical @eleven_ty account on Twitter](https://twitter.com/eleven_ty) and Eleventy's creator, Zach Leatherman, will often answer or RT for reach to the community. He's also quick to amplify blog posts and other things made by and for Eleventy if you tag the account.

---

## Create an Eleventy Site in 3 Minutes

> These steps are also very similar to what is described in my tutorial on [building your first 11ty site](/posts/create-your-first-basic-11ty-website) which includes code samples for all steps.

**This 3 minute video is followed by the transcript and a few code samples**:

<div class="tdbc-video"><iframe title="YouTube video: Build an 11ty Site in 3 Minutes" src="https://www.youtube-nocookie.com/embed/BKdQEXqfFA0?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

Ok! So I hope you're excited and maybe even have a project in mind to try to build with Eleventy!

So now we're going to build an Eleventy site in 3 minutes and following that we'll see the features we talked about in action and will follow this with some examples of going beyond static with Eleventy.

The first important lesson after we init a new project and get ready to install Eleventy is that it is a scoped package, so you install it with `@11ty/eleventy`.

Once the installs complete, we'll open package.json and update the default scripts section. This enables a start command to run 11ty with hot-reload, which is provided by Browsersync that comes bundled as part of 11ty's `--serve` directive.

```json
"scripts": {
  "start": "npx @11ty/eleventy --serve",
  "build": "npx @11ty/eleventy"
},
```

Next, we create the config file to perform an optional step which is to update our input and output directory, my preference being `src` for "input" and `public` for the output.

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

Then we need to create a **layout** file and an **index** file. You can certainly combine these steps, but to take full advantage of templating features, I recommend using layouts from the start.

Eleventy expects layouts to be located in the `_includes` directory, and we'll create a Nunjucks file called `base`. Our layout will use the HTML5 boilerplate, and we'll prepare it for the incoming content by adding the variable of `{% raw %}{{ title }}{% endraw %}` which will be provided by frontmatter. We'll also stub out a nice semantic starting point for the body, adding the `title` again as the `h1` and use the template variable for `content` followed by the `safe` filter to say we expect and want to allow any HTML content here.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }}</title>
  </head>
  <body>
    <header>
      <h1>{{ title }}</h1>
    </header>
    <main>{{ content | safe }}</main>
  </body>
</html>
```

Now in our `src` we'll create `index.md` and add the frontmatter key of `title` with a nice "Hello World", and a small message to make sure our content is working. We'll also attach it to our layout with the frontmatter key of `layout` and set the value to the filename of `base.njk`.

```md
---
title: Hello World
layout: "base.njk"
---

Hello Jamstack fam!
```

Finally, we'll open Terminal and run the `npm start` command we setup which launches a local server. We do still have to open this in a browser ourselves, but you'll see that we have successfully created our first page.

We'd like a little style for this, so let's create `style.css`. The one trick here is we need to make Eleventy aware of this CSS file as it's not presently included, but first we'll link to it in our base layout. Then back in our config we'll add `style.css` as a passthrough copy target, and now we have a lovely sans-serif theme kicked off.

```js
// Add within .eleventy.js
eleventyConfig.addPassthroughCopy("./src/style.css");
```

Finally, to add a blog, we'll create a `posts` directory and add `my-first-post` with a title and a bit of content, then a directory data file using the directory name as the filename, to send it to the `base` layout and add the tags to create the`posts` collection.

And back in our `index` we'll loop over the new `posts` collection.

```twig
{% raw %}{% for post in collections.post -%}
- [{{ post.data.title }}]({{ post.url }})
{% endfor %}{% endraw %}
```

And there we have essential basics of getting started with Eleventy.

---

## Going Beyond Static

With Eleventy, I can go from idea to publish in a matter of hours, with only the speed of typing in my way. 😉 It's made me feel the magic of web development again.

So I'd like to share some of those projects as examples of going beyond static, which to me means using the features we discussed to their full capability to extend beyond _just_ HTML output from static, local content.

### Style Stage - Non-CMS Community Contributions

My first large project with Eleventy was [StyleStage.dev](https://stylestage.dev) which is a modern CSS showcase styled by community contributions.

[![Preview of the StyleStage.dev home page]({{ imgBase}}stylestage.png)](https://stylestage.dev)

The key here is that anyone can contribute a stylesheet.

The way that is setup is by allowing contributors to add their own JSON file within the `_data` directory. Those then get globbed together to create the collection for use on the site, and also a JSON file is created to generate social share images like I described earlier.

Eleventy in this instance enables a simple mechanism for contributors that doesn't require managing a CMS or worrying about other forms of authorization because GitHub helps provide that layer. Coupled with Netlify, any new PR gets it's own deployed branch to enable me to reveiw submissions to ensure they meet the guidelines and help work with the contributor to resolve any issues or bugs.

This has enabled contributors of many skill levels, and [there are 50+ styles available](https://stylestage.dev/styles/) for review on the site today.

## Generators

Next we'll go a bit more outside the box with a series of generators that are intended to:

1. produce an asset, or
2. provide an environment instead of a static site for publish

### Email Generator

First up is the example of an email generator.

In this case, front matter is heavily leveraged to populate areas of the table-based template layout, but Markdown is used for the main content.

![Preview of the email design created in this generator, showing part of the hero image, a headline, and some body copy]({{ imgBase }}11ty-email.jpg)

The generator is setup to allow initial email styling with Sass. With the build command, the compiled template content is fed through a filter that hooks in the juice package which provides the style inlining functionality that is required for the best email style compatibility.

So the output in this case is the compiled email template, but during the build Eleventy provides a comfortable environment where I can tuck away the fact that ultimately an email is comprised of tables for layout.

> [Get the email generator](https://github.com/5t3ph/11ty-email-generator) on GitHub!

### Web Component Generator

This year I also started learning about web components. But I found them a bit uncomfortable to build as a hobbyist who was looking for a couple small use components versus building a whole system.

I thought I may not quite be able to accomplish compiling a web component with Eleventy, but two hours later I had a proof of concept deployed. The resulting environment allows generating web components in a way that separates concerns, and enables including them in pages to test the component during build out.

To accomplish this, the generator exploits the layout functionality to inject the web component's scripts and styles into the required location to create the final JavaScript file.

The web component's HTML template is created as Nunjucks file, and the associated script and style is created in the `_includes` as if they were layout partials. To dynamically tie it all together, the generator expects that the Nunjucks template and the directory for the scripts and styles in `_includes` share the same kebab-cased filename.

Any created web component is fed into a unified `components` Nunjucks template that allows bringing all the pieces together to be ready for what is ultimately output as a JavaScript file ready to be used as a web component.

![Illustration showing the scenario described in the prior paragraphs of the Nunjucks template, a script file, and a CSS file being fed into the Nunucks template that will output the web component JavaScript]({{ imgBase }}web-components.jpg)

In this case, the site could theoretically both create and consume the web components if the author so desired. Since this is still a POC, there's room to improve by adding a transpiler or enabling Sass in addition to vanilla CSS.

> Learn more and [demo the generator](https://11ty-web-component-generator.netlify.app/) and clone it for your own use!

## CSS Houdini Worklet Generator

Next up is probably my most unusual idea to date.

One area of CSS I hadn't had the opportunity to explore until recently was Houdini.

When I went to try to understand it better, I found many wonderful resources but no existing starting environment to build from.

In the case of CSS Houdini, it is actually a requirement to be running on a secure or local server. The file used for Houdini is called a worklet and is created with JavaScript. There are a few flavors of Houdini available but the currently best supported version is the Paint API. This API will look familiar to those of you who have used canvas. And a disclaimer here: everything that I just said and am about to show you was new to me, so there is ample room for improvement!

Presently, this generator is setup to only create one worklet, because ultimately the idea is that the produced files can be published as a package to be available for wider consumption. However, it could be extended to create a set of related worklets.

![Preview of the generator demo Houdini worklet which draws a rectangle within the elements box at the requested coordinates, in this case a magenta rectangle over the top left behind the words 'Hello World']({{ imgBase }}houdini-worklet.png)

For this generator, the worklet is created all in itself, unlike the email or web component generators which compile files together.

But Eleventy helps provdie the local server, and the base template to serve the worklet as well as the currently required polyfill to enable testing. Plus since Eleventy runs on Node and therefore we've already got a `package` file available, it made it easy to prepare it as an all-in-one solution to publish the final package from.

For this generator, the benefit of Eleventy was providing a slim environment that provided the required local server and no extra fluff beyond that.

> Learn more and get [the CSS Houdini Generator](https://github.com/5t3ph/11ty-css-houdini) on GitHub!

### ButtonBuddy

Cool, so we've talked about features inherit to Eleventy that allow us to do things beyond generate a simple static site.

But what if you do need some client-side JavaScript?

For most of my projects, I either really don't need any JS, or a small enough bit that I could write it vanilla with no worries about compatibility. But then I had the idea for a client-side generator that I really needed to include functionality from available packages.

My web app, [ButtonBuddy](https://buttonbuddy.dev), helps you check or create an accessible color palette for your buttons, and the main package I needed to include was to do the calculations to determine the contrast ratio.

With this project, I learned there were many ways folx were adding bundling or transpiling, but personally I was familiair with Parcel from projects in my previous work life.

So here I need to give credit to Michelle Barker who created the [`eleventy-parcel` starter](https://github.com/mbarker84/eleventy-parcel) which was a beautifully slim setup that hooked in Parcel minimally at the last step of the build process.

Within no time, I was able to add in the necessary bits to my in-progress project and was off to the races using ES6 for ease of putting together the web app functionality. Did I mention Eleventy has a great community? 🙂

I wanted to include this example if you have had concerns that Eleventy was going to lock you into only static without an easy plan to include modern, client-side JS when you really needed it. As I mentioned, I do have a history with React and Gatsby, and I'll say that Eleventy + Parcel got me precisely what I needed in a very efficient manner.

> Check out this project at [ButtonBuddy.dev](https://buttonbuddy.dev)

---

## Summary

Eleventy has given me a bit of a can't stop, won't stop attitude toward building for my own joy of the craft of web development. And these mini projects have been amazing for learning new things, getting feedback, and growing my network and connections to a whole new community of awesome web makers.

So whether you're looking for a replacement for an older setup but otherwise content with truly static, or you're interested in upgrading your playground environment and exploiting some of the other features we talked about today, I encourage you to give Eleventy a try!

> Be sure to bookmark this site, or [pick up the RSS feed](/feed/) to keep updated of new resources! [Reach out on Twitter](https://twitter.com/5t3ph) if you have questions or suggestions of topics to cover.
