require('dotenv').config({ path: `.env.${process.env.ENV_STAGE}` })
const webpack = require('webpack')
const path = require('path')
const ENV = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
process.env.VUE_APP_ENV_STAGE = process.env.ENV_STAGE //将ENV_STAGE 赋值给VUE_APP_ENV_STAGE 全局引用
const version = new Date().getTime()
/* eslint-disable */
const CONFIG = {
  TITLE: '正丁-小工具管理系统',
  DEVSERVER:
    process.env.ENV_STAGE === 'serve'
      ? {
        //端口号
        port: 8080,
        proxy: {
          '/baidu': {
            target: 'https://aip.baidubce.com',
            ws: true,
            changeOrigin: true, //允许跨域
            pathRewrite: {
              '^/baidu': '' //请求的时候使用这个/baidu 就可以
            }
          },
          '/api': {
            target: 'http://192.168.10.198:3000'
          },
          '/': {
            target: process.env.VUE_APP_BASE_URL,
            changeOrigin: true
          }
        }
      }
      : {
        proxy: {
          '/api': {
            target: 'http://192.168.10.198:3000'
          }
        }
      }
}

/* eslint-enable */

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  lintOnSave: isDev,
  publicPath: isDev ? './' : '/',
  outputDir: 'dist',
  productionSourceMap: isDev,

  configureWebpack: (config) => {
    //生产环境去除log
    if (ENV === 'production') {
      config.output.filename = 'js/[name].[chunkhash:8].' + version + '.js'
      config.output.chunkFilename = 'js/[name].[chunkhash:8].' + version + '.js'
      const compress = config.optimization.minimizer[0].options.terserOptions.compress
      compress.warnings = false
      compress.drop_console = true
      compress.drop_debugger = true
      compress.pure_funcs = ['console.log']
    }
    return {
      resolve: {
        alias: {
          '~': '@/views/components'
        }
      }
    }
  },
  devServer: {
    //排查异常时候开启
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    ...CONFIG.DEVSERVER
  },

  chainWebpack: (config) => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    //在js中刪除worker的编译，触发热更新
    config.module.rule('js').exclude.add(/\.worker\.js$/)
    //worker-loder
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        filename: '[name].[contenthash].worker.js'
      })

    // config
    //   .when(ENV === 'production', config => {
    //     config.plugin('webpackOptimize').use(webpack.optimize.LimitChunkCountPlugin, [{
    //       maxChunks: 10
    //     }]).use(webpack.optimize.MinChunkSizePlugin, [{
    //       minChunkSize: 50000
    //     }])
    //   })

    config.plugin('html').tap((args) => {
      args[0].title = CONFIG.TITLE
      return args
    })
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        additionalData: `
            @import "~@/styles/function.scss";
            @import "~@/styles/variables.scss";
            @import "~@/styles/mixin.scss";
        `
      }
    }
  }
}
