const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackBar = require('webpackbar')
const WorkboxPlugin = require('workbox-webpack-plugin')
const VConsolePlugin = require('vconsole-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)
const isProd = ['production'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: isProd ? process.env.VUE_APP_SRC || '/' : '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  lintOnSave: true, // 使用 eslint
  productionSourceMap: false, // 生产环境的 source map

  css: {
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    // 是否使用css分离插件 ExtractTextPlugin 生产环境下是 true,开发环境下是 false
    // 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。
    // 因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。
    // 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。
    extract: false,
    // 开启 CSS source maps
    sourceMap: false,
    // css 预设器配置项
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        // data: `@import "~assets/scss/variables.scss"; $src: "${process.env.VUE_APP_SRC}";`
        data: `@import "./src/styles/setting.scss";`
      }
    }
  },

  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@a', resolve('src/assets'))
      .set('@c', resolve('src/components'))
      .set('@v', resolve('src/views'))

    if (isProd) {
      const plugins = []
      const cdn = {
        js: [
          '//cdn.staticfile.org/vue/2.6.6/vue.min.js',
          '//cdn.staticfile.org/vue-router/3.0.2/vue-router.min.js',
          '//cdn.staticfile.org/vuex/3.1.0/vuex.min.js',
          '//cdn.staticfile.org/axios/0.18.0/axios.min.js',
          '//cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js'
        ]
      }

      // 修改 config, 使其不打包externals下的资源
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        'js-cookie': 'Cookies'
      }

      // 添加 cdn 参数到 htmlWebpackPlugin 配置中
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })

      // 移除 console
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )

      config.plugins = [...config.plugins, ...plugins]
    }

    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }

    // 压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: '65-90', speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 }
      })

    // 多页面配置，为js添加hash
    // config.output.chunkFilename(`js/[name].[chunkhash:8].js`)

    // 修改图片输出路径
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .options({
    //       name: path.join('../assets/', 'img/[name].[ext]')
    //   })
  },

  configureWebpack: config => {
    // webpack 进度条
    config.plugins.push(new WebpackBar())

    // 开启 gzip ,需要服务端支持
    // nginx 配置如下：
    // gzip on;
    // gzip_static on;
    // gzip_min_length 1024;
    // gzip_buffers 4 16k;
    // gzip_comp_level 2;
    // gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    // gzip_vary off;
    // gzip_disable "MSIE [1-6]\.";
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    )

    // 使用 vConsole
    config.plugins.push(
      new VConsolePlugin({
        enable: process.env.NODE_ENV === 'pre-release'
      })
    )

    // 使用 workbox 提升二次加载速度
    config.plugins.push(
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
        skipWaiting: true // 强制等待中的 Service Worker 被激活
      })
    )
  },
  pwa: {},
  devServer: {
    open: true,
    host: '127.0.0.1',
    port: 8080,
    disableHostCheck: true, // 解决 invalid host header
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:8080',
        secure: true, // 是否验证SSL证书
        changeOrigin: true // 将主机标头的原点更改为目标URL，允许接口跨域
      }
    }
  }
}
