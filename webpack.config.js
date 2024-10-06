const path = require('path');
const theme = require('./theme')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const moduleCSSLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    importLoaders: 2,
    modules: {
      localIdentName: '[local]_[hash:base64:5]'
    },
  }
}

const modulePostCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        ['postcss-flexbugs-fixes'],
        ['autoprefixer', {
          remove: false,
          flexbox: 'no-2009'
        }]
      ]
    }
  },
}

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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        //针对antd less样式
        test: /\.less$/,
        exclude: /src/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          modulePostCssLoader,
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
        //components下的css不用cssModule，不然没法复写
        test: /\.styl$/,
        include: /components/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
          modulePostCssLoader,
          'stylus-loader'
        ]
      },
      {
        test: /\.styl$/,
        exclude: /components/,
        use: [
          MiniCssExtractPlugin.loader,
          moduleCSSLoader,
          modulePostCssLoader,
          'stylus-loader'
        ]
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
