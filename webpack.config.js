const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV.trim();
const isProduction = env === 'production';
const isDevelopment = env === 'development';

const config = {
  devServer: isDevelopment
    ? {
      contentBase: './dist',
      historyApiFallback: true,
      stats: {
        hash: false,
        version: false,
        assets: false,
        chunks: false,
        modules: false,
        children: false,
        warnings: false
      }
    }
    : {},
  entry: './src/index.tsx',
  output: {
    path: `${__dirname}/dist`,
    filename: isDevelopment
      ? '[name].bundle.js'
      : '[name].bundle.[chunkhash].js',
    publicPath: isDevelopment ? '/' : '/dist'
  },
  mode: env,
  devtool: isDevelopment ? 'inline-source-map' : 'none',
  module: {
    rules: [
      {
        test: /^((?!module).)*.s[c]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.module\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDevelopment
                  ? '[path]___[name]_[local]_[hash:base64:5]'
                  : '[hash:base64:10]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    isProduction ? new CleanWebpackPlugin() : null
  ].filter(plugin => plugin !== null)
};

module.exports = config;
