---
title: "Building A Membership Site With 11ty"
description: "Do you want to offer exclusive content, but also have full control over the platform you use? With the power combo of Eleventy, Netlify, and Supabase, we’ll create an authenticated membership site, no frameworks required."
templateEngineOverride: md
date: 2023-01-26
---

> _Spoiler_: This is available as [an Eleventy theme](https://github.com/5t3ph/11ty-membership-site) over on GitHub. Read on to explore key concepts about developing using Eleventy Edge.

A new feature with Eleventy v2 (currently in beta) is Eleventy Edge.

What is "the Edge?" Here's a super brief summary:

- Low-latency nodes geographically close to the user
  - Faster processing of Edge functions vs. serverless
  - Retrieve user-specific data, ex. timezone, cookies
- “Middleware” to intercept page requests before they are rendered
- Allow redirecting or modifying requested content

These features allow us to enable authenticated routes for our 11ty site. And the opt-in Eleventy Edge plugin enables us to add and use Edge-generated data within otherwise static 11ty templates.

## Prerequisites

- 11ty v2 beta+ (included in the [membership theme](https://github.com/5t3ph/11ty-membership-site))
- [Netlify account](https://netlify.com)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Supabase account](https://supabase.io)

Additionally, opting-in to the [Eleventy Edge plugin](https://www.11ty.dev/docs/plugins/edge/). This is not a separate install, but it is not included in your build by default. The following are the parts to include (if you are not using [the theme](<(https://github.com/5t3ph/11ty-membership-site)>)).

```js
const { EleventyEdgePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Opt-in to 11ty Edge
  eleventyConfig.addPlugin(EleventyEdgePlugin);
};
```

## How it works

Supabase out-of-the-box has user sigups enabled, and from that we can setup "magic link" authentication as a starting point. This means a new or returning user enters their email and Supabase sends an email with a one-time access token. It's then up to our site for how to handle the user's journey after they return with that token.

For our minimum-viable membership site, here are the features:

- Authenticate users with Supabase Magic Links and provide members-only content
- Offer partial content previews to unauthenticated users
- Build using 11ty, Netlify Edge, and Supabase
- Use no frameworks or bundlers, just vanilla JS (+ Deno on the Edge), Nunjucks, and Markdown

So, how does this come together? First, Supabase offers an API and functions to easily trigger the necessary actions like login, and retrieval of a user's session details.

With the Netlify CLI, we have access to environment variables stored in our Netlify account so that those can be shared to local dev. The Netlify CLI also enables actually using the Edge functions for local development.

With Edge + Supabase, we don't need a single-page application framework because only a couple of tiny JavaScript functions are required client-side for initial login! We'll create a cookie on the Edge to store an `_access_token` based on Supabase session details to use for subsequent page requests.

Eleventy Edge then is attached to each page load where we check for the `_access_token` cookie and use the value to validate a user. Edge checks the user's status before they see any page content and sends down an `isUser` variable to pick up in our 11ty templates. Within the `{% edge %}` shortcode provided by the plugin is where we render the members-only content, or prompt for a login.

The rest is leveraging the Nunjucks templating language, and also using Markdown as the way to author post content.

## Authentication Flow

![Authentication flow as described following the image](/img/authentication-flow.png)

1. User enters email and triggers magic link login from either the index or a post
2. Supabase auth sends a magic link to user's email
3. User returns through magic link and arrives at `/session/` where:
   - Supabase saves session data to localStorage
   - `session.js` picks up the session variables and redirects to `/access/`
4. `/access/` route loads the `netlify/edge-functions/login.js` Edge function which saves the `_access_token` cookie\*
5. User redirected to the login-originating page (either the index or a specific post)

> \* **Why a cookie?** Edge functions can read cookies from page headers, so it's used to validate sessions across page loads.

### Assigning routes to Edge functions

Netlify Edge looks at the `netlify.toml` file to determine when to pass a page request through an Edge Function.

Here's the example of setting the route for the `login` Edge function:

```toml
[[edge_functions]]
path = "/access/*"
function = "login"
```

## Members-Only Content Flow

![Members-only content flow, as described following the image](/img/gated-content-flow.png)

1. The author determines which content (if any) will be gated by setting the `premium` variable
2. When a user visits a gated post, the 11ty Edge function (`netlify/edge-functions/eleventy-edge.js`) checks their authenticated status with Supabase, and sets `isUser` as global data for access within the `{% edge %}` shortcode
   - If `isUser: true` - user sees the premium content
   - If `isUser: false` - user sees partial content and the login form

The `isUser` variable is made available because Eleventy Edge allows creating global data on-the-fly! With one caveat: it's exclusive to the `edge` shortcode and only on routes covered by the Edge function. In other words, it is dynamic and isolated to that page load, and does not become a part of the static 11ty build.

### Authoring premium content

How does it look to set the `premium` variable? Here's an example post which is written in Markdown and uses Nunjucks for assigning the variable.

```twig
Example post content outside of the gated, members-only content.

{% set premium %}

This content is super premium! For members only!!

{% endset %}

{% include "components/gate.njk" %}
```

We then include a Nunjucks partial `gate.njk` after setting the `premium` variable which includes the `{% edge %}` shortcode and determines whether the user can see the premium content.

> **Note:** We have to place the include alongside the content template rathen than in the layout used by the post because the `premium` variable will not be available to a layout. So, the include must be added by authors on each post with members-only content.

```twig
{# gate.njk #}

{% set loginform %}
{% set loginHeadline = "To continue reading, join or login" %}
{% include "components/loginform.njk" %}
{% endset %}

{% edge "njk, md", { premium: premium, loginform: loginform } %}
  {% if premium %}
    {% if isUser %}
      {{ premium }}
    {% else %}
      {{ loginform | safe }}
    {% endif %}
  {% endif %}
{% endedge %}
```

For the shortcode, we also designate which templating languages it should use to process the content: Nunjucks `njk` and Markdown `md`. We need Markdown so that it transforms the authored post content within the `premium` variable.

An important concept is that **Eleventy Edge is not aware of data from your 11ty site** so it must be explicitly passed into the shortcode. That's why we must set the `loginform` include as a variable as well. Additionally, in order to have named variables within the shortcode, we have to pass them in as an object (but remember: this is Nunjucks, not JS!).

Finally, the logic within the shortcode says: "If there is premium content and also a valid user, we can show them the content. Otherwise, show the login form instead."

## Next steps and resources

There are several opportunities for enhancements from [the starter theme](https://github.com/5t3ph/11ty-membership-site).

- Create a user dashboard
- Persist user profile data to Supabase
- Add in payment processing
- Use [WebC](https://11ty.rocks/posts/introduction-webc/) to save content bookmarks or perform other client-side interactions

Here are resources to help understand each of the necessary parts more in-depth, and learn how to extend the functionality:

- Learn more about all kinds of 11ty topics here on 11ty Rocks!
- [11ty Edge docs](https://www.11ty.dev/docs/plugins/edge/)
- [Supabase authentication docs](https://supabase.com/docs/guides/auth/overview)
- [Netlify Edge docs](https://docs.netlify.com/edge-functions/overview/)
