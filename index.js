/* 由于 node 使用 commonJs 规范，所以使用 es6 语法需要使用 babel 进行转换
   node 9.0 之后的版本支持了 es6 语法，但是鉴于非稳定版本，未使用 node 9.0

require('babel-register');
const babel = require('@babel/core');
const babelPresetLatestNode = require('babel-preset-latest-node');

babel.transform('code();', {
  presets: [[babelPresetLatestNode, {
    target: 'current',
  }]],
});

require('babel-polyfill'); */
require('./src');
