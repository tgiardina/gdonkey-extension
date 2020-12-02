const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',     
  mode: "development",  
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, '../dist'),    
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],  
};
