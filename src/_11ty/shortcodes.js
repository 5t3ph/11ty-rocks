const year = () => `${new Date().getFullYear()}`;

const codeDemo = (css, html) => {
  if (!html.length) return "";

  if (!css) {
    return `
<div class="demo">
${html}
</div>`;
  }

  const hash = Math.floor(Math.random(100) * Math.floor(999));

  const cssRE = new RegExp(/(?<=\.)([\w|-]+)(?=\s|,)/, "gm");
  const cssCode = css.replace(cssRE, `$1-${hash}`);

  let htmlCode = html;
  css.match(cssRE).forEach((match) => {
    // prettier-ignore
    const htmlPattern = match.replace("-", "\\-");
    const htmlRE = new RegExp(`(${htmlPattern})(?=\\s|")`, "gm");
    htmlCode = htmlCode.replace(htmlRE, `${match}-${hash}`);
  });

  return `
<style>${cssCode}</style>
<div class="demo">
${htmlCode}
</div>`;
};

module.exports = {
  year,
  codeDemo,
};
