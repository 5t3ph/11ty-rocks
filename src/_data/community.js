"use strict";
const fastglob = require("fast-glob");
const fs = require("fs");

module.exports = async () => {
  // Create a "glob" of all community posts
  const communityPosts = await fastglob("./src/community/*.json", {
    caseSensitiveMatch: false,
  });

  // Loop through those files and add their content to our `posts` Set
  let posts = new Set();
  for (let post of communityPosts) {
    if (!post.includes("FORMAT")) {
      const postData = JSON.parse(fs.readFileSync(post));
      posts.add(postData);
    }
  }

  // Return the posts Set of objects within an array
  return [...posts];
};
