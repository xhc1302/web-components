const path = require('path');
const theme = require('./theme')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'eaiot-web-components', // 自定义库名称
    libraryTarget: 'umd',  // 支持多种模块系统
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        //针对antd less样式
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: theme
              }
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true, // 启用 CSS Modules
              sourceMap: true,
              importLoaders: 2,
              modules: false
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    antd: 'antd'
  }
};
