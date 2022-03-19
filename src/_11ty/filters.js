const slugify = require("slugify");
const { DateTime } = require("luxon");

const slug = (str) => {
  if (!str) {
    return;
  }

  return slugify(str, {
    lower: true,
    strict: true,
    remove: /["]/g,
  });
};

const postDate = (dateObj) => {
  return DateTime.fromJSDate(new Date(dateObj), {
    zone: "UTC",
  }).toLocaleString(DateTime.DATE_MED);
};

const excerpt = (post) => {
  const content = post.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
};

const hasTag = (tags, tag) => {
  return tags.includes(tag);
};

const stripFilename = (file) => {
  return file.replace(/\.[^/.]+$/, "");
};

const head = (array, n) => {
  if (n < 0) {
    return array.slice(n);
  }

  return array.slice(0, n);
};

const pluck = (arr, attr, value) => {
  return arr.filter((item) => item.data[attr] === value);
};

module.exports = {
  slug,
  postDate,
  excerpt,
  hasTag,
  stripFilename,
  head,
  pluck,
};
