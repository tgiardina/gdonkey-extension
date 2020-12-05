const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',      
  mode: "development",  
  entry: {
    background: './src/background/src/index.ts',
    content: './src/content/src/index.ts',
    popup: './src/popup/src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,        
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },      
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    symlinks: false,    
    alias: {
      path: 'path-browserify',
    },    
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./assets/images/icon-128.png",
          to: "./assets/images/icon-128.png",
        },
        {
          from: "./assets/images/icon-gray-128.png",
          to: "./assets/images/icon-gray-128.png",
        },        
      ]
    }),
    new Dotenv({ path: './.env' }),
    new HtmlWebpackPlugin({
      template: "./src/popup/public/index.html",
      filename: "./popup.html",
    }),    
  ],  
};