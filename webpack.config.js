const defaults = require("@wordpress/scripts/config/webpack.config");

const setTitle = require("node-bash-title");

setTitle('🔎 CTCI Search');

module.exports = {
	...defaults
};