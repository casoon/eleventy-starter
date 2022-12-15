module.exports = {
	// Collections
	Posts: function (collection) {
		return collection.getFilteredByGlob("**/_posts/*.md").reverse();
	},
	Sitemap: function (collection) {
		return collection.getFilteredByGlob("**/*.njk").filter(
			page => page.data.draft !== true
		);
	},
};
