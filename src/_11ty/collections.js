const orderedResources = (collection) => {
  return collection
    .getFilteredByTag("resources")
    .filter((p) => !p.data.tags.includes("links"))
    .sort((a, b) => {
      return a.data.order - b.data.order;
    });
};

const communityResources = (collection) => {
  return collection.getAll()[0].data.community.sort((a, b) => {
    return b["yyyy-mm-dd"].replace(/-/g, "") - a["yyyy-mm-dd"].replace(/-/g, "");
  });
};

const orderedLinks = (collection) => {
  return collection.getFilteredByTag("links").sort((a, b) => {
    return a.data.order - b.data.order;
  });
};

module.exports = {
  orderedResources,
  communityResources,
  orderedLinks,
};
