const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const dist = isProduction ? 'dist-prod' : 'dist-dev';

const config = {
  entry: {
    main: path.resolve(__dirname, 'main.mjs')
  },
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, dist)
  },
  devServer: {
    static: {
      directory: path.join(__dirname, dist),
    },
    port: process.env.PORT ?? 3005,
  },
  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: './src/html/index.html',
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ],
  },
  module: {
    rules: [
      // css rules
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      // img rules
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // font rules
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },

      // babel rules
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
