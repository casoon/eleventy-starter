module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2022,
	},
	rules: {
		// Match .editorconfig
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
