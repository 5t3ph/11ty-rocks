export class EleventyWebring extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = `
			<style>
			* {
				box-sizing: border-box;
			}
			.eleventywr {
  text-align: var(--eleventywr-text-align, center);
  color: var(--eleventywr-text-color, inherit);
  font-family: var(
    --eleventywr-font-family,
    -apple-system,
    blinkmacsystemfont,
    avenir next,
    avenir,
    helvetica neue,
    helvetica,
    ubuntu,
    roboto,
    noto,
    segoe ui,
    arial,
    sans-serif
  );
  font-size: var(--eleventywr-font-size, 1.125rem);
}
.eleventywr p,
.eleventywr-title {
  margin: 0 0 0.65em;
}
.eleventywr-title {
  color: var(--eleventywr-title-color, inherit);
  font-size: var(--eleventywr-title-size, 2.5rem);
  font-family: var(--eleventywr-title-font-family, "Arbutus Slab", sans-serif);
}
.eleventywr-list {
  list-style: none;
  margin: 0 auto 1.5rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: var(--eleventywr-linkflex-justify, center);
}
.eleventywr-list li {
  padding: 0.5em;
}
.eleventywr-list li:not(:last-child):after {
  content: "•";
  transform: translateX(0.25em) scale(0.8);
  position: absolute;
  opacity: 0.6;
}
.eleventywr-list a {
  color: var(--eleventywr-link-color, #0370ba);
}
.eleventywr-join {
  text-decoration: none;
  text-align: center;
  background-color: var(--eleventywr-button-bgcolor, #0d3233);
  color: var(--eleventywr-button-color, #fff);
  padding: var(--eleventywr-button-padding, 0.25em 1em);
  border-radius: var(--eleventywr-button-border-radius, 4px);
  display: inline-flex;
  font-size: var(--eleventywr-button-font-size, 1.125rem);
}
.eleventywr-join:focus {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 1px var(--eleventywr-button-color, #fff),
    0 0 0 3px var(--eleventywr-button-bgcolor, #0d3233);
}
.eleventywr-hide {
  display: none;
}

			</style>
			<aside class="eleventywr">
  <h2 class="eleventywr-title">11ty Webring</h2>
  <p>Enjoy more projects from the 11ty community!</p>
  <ul role="list" class="eleventywr-list"></ul>
  <a target="_blank" rel=”noopener noreferrer” href="https://github.com/5t3ph/11ty-rocks/blob/main/join-webring.md" class="eleventywr-join">Join this Webring</a>
</aside>
    `;
    const list = shadowRoot.querySelector(".eleventywr-list");
    const limit = this.getAttribute("limit") ? this.getAttribute("limit") : false;
    const current = this.getAttribute("current");
    const random = this.getAttribute("random");
    const hideJoin = this.getAttribute("hideJoin");

    const getWebring = async () => {
      let webringUrl = "https://11ty.rocks/js/eleventy-webring.json";
      if (!window.location.href.includes("11ty.rocks")) {
        webringUrl = "/js/eleventy-webring.json";
      }
      const postResp = await fetch(webringUrl);
      let webring = await postResp.json();

      if (current) {
        webring = webring.filter((link) => link.title !== current);
      }

      if (random) {
        webring = webring.sort(() => Math.random() - 0.5);
      }

      if (limit) {
        webring = webring.slice(0, limit);
      }

      if (hideJoin) {
        shadowRoot.querySelector(".eleventywr-join").classList.add("eleventywr-hide");
      }

      return webring
        .map((item) => {
          return `<li><a href="${item.link}">${item.title}</a></li>`;
        })
        .join("");
    };

    getWebring()
      .then((webring) => {
        list.innerHTML = webring;
      })
      .catch(() => {
        list.innerHTML = `<li><em>No one else is in the webring yet - will you join?</em></li>`;
      });
  }
}

window.customElements.define("eleventy-webring", EleventyWebring);
