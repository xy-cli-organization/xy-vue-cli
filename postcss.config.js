module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': { // 使用大写 PX 可以忽略转换，如 border
      'rootValue': 100, // 1rem = 100px
      'propList': ['*'], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
      // 若有使用第三方UI，要配置下忽略选择器不转换。规则是class中包含的字符串，例如vant中所有class的前缀均为van-。也可以是正则。
      'selectorBlackList': ['van-']
    }
  }
}
