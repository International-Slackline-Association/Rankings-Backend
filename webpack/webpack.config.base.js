const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const _ = require('lodash');
const slsw = require('serverless-webpack');
require('source-map-support').install();

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const rootDir = path.join(__dirname, "../");

const defaults = {
    entry: slsw.lib.entries,
    target: 'node',
    // mode: slsw.lib.webpack.isLocal ? "development" : "production",
    mode: 'none',
    externals: nodeExternals({ whitelist: ['winston-cloudwatch'] }),
    plugins: [
        // new BundleAnalyzerPlugin()
        // new UglifyJsPlugin({
        //     sourceMap: false,
        // }),
    ],
    optimization: {
        nodeEnv: false
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: [
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx',
        ],
        alias: {
        },
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(rootDir, '.webpack'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: { /* Loader options go here */ }
            }
        ],
    },
};

module.exports.defaults = defaults;

module.exports.merge = function merge(config) {
    return _.merge({}, defaults, config);
};

/* Nest scaffold webpack options

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/main.hmr.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};
*/