const path = require('path');

const includePaths = [
  path.resolve(__dirname,'webpack.config.js'),
  path.resolve(__dirname, 'dist'),
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'types'),
  path.resolve(__dirname,'node_modules','three')
];

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ARnftThreejs.js',
    library: 'ARnftThreejs',
    libraryTarget: 'umd',
    // @see: https://github.com/webpack/webpack/issues/3929
    libraryExport: 'default',
    // @see: https://github.com/webpack/webpack/issues/6522
    globalObject: 'this',
  },
  externals: {
    three: {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE' // indicates global variable
    }
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        //exclude: /node_modules/,
        include: includePaths,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // @see https://github.com/babel/babel/issues/9849
              ['@babel/transform-runtime']
            ]
          }
        },
        {
          loader: 'ts-loader',
        }
      ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
