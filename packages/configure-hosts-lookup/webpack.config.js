const path = require('path');
const webpackMerge = require('webpack-merge');
const baseComponentConfig = require('@splunk/webpack-configs/component.config').default;

module.exports = webpackMerge(baseComponentConfig, {
    entry: {
        ConfigureHostsLookup: path.join(__dirname, 'src/ConfigureHostsLookup.tsx'),
    },
    output: {
        path: path.join(__dirname),
    },
});
