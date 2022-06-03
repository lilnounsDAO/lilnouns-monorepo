const webpack = require('webpack');
require("dotenv").config()

const addIgnoreSourcemapsloaderWarnings = config => {
  config.ignoreWarnings = [
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    /**
     *
     * @param {import('webpack').WebpackError} warning
     * @returns {boolean}
     */
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes('node_modules') &&
        warning.details &&
        warning.details.includes('source-map-loader')
      );
    },
  ];
  return config;
};

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    // fullySpecified: false,
    // GENERATE_SOURCEMAP: false,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    url: require.resolve('url'),
    fs: false,
    fullySpecified: false,
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
    buffer: require.resolve('buffer'),
    util: require.resolve('util'),
  });

  
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      // test: /\.m?js/,
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};
