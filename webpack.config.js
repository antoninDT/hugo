// const path = require('path');
//
// module.exports = {
//   entry: './src/index.jsx',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   }
// };
var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
};
