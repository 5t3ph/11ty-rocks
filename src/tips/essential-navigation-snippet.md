---
title: "Essential Navigation Snippet"
description: "Grab this snippet to quickly add a basic navigation partial that includes highlighting the current page"
date: 2021-03-09
updatedOn: 2021-10-09
---

The following snippet uses Nunjucks and could be added directly in a layout, or created as a layout partial - ex: `nav.njk`.

First, we set the variable of `currentUrl` to contain the current page URL, and if it matches the the nav item's URL, we add the appropriate aria to identify it as the current page.

In this example we are looping through the `pages` collection, which you may need to adjust to match your desired navigation content.

```twig
{%raw%}
{% set currentUrl = page.url %}

<nav>
  <ul role="list">
    <li>
      <a {% if currentUrl === '/' %}aria-current="page"{% endif %} href="/">Home</a>
    </li>

    {% for link in collections.pages %}
    <li>
      <a
        {% if currentUrl === link.url %}aria-current="page"{% endif %}
        href="{{ link.url }}">
          {{ link.data.title }}
      </a>
    </li>
    {%- endfor %}
  </ul>
</nav>
{%endraw%}
```

> This navigation strategy is in use for my [Smol 11ty Starter](https://smol-11ty-starter.netlify.app/)

**Bonus tip**: Attach styles to the current item by using the CSS selector `[aria-current="page"]` to for example bold the current item, or change its color.

> For deeper hierarchies and more complex navigation, you may want to use the official plugin: []()
