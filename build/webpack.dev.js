const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
var notifier = require('node-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const devWebpackConfig = merge(webpackConfig,{
    mode:"development",
    devtool:'cheap-module-eval-source-map',
    output:{
        filename:'static/js/[name].[hash:8].js',
        chunkFilename:'static/js/[name].[hash:8].js'
    },
    devServer:{
        hot:true,
        port: 3000,
        contentBase: path.resolve(__dirname,'../dist'),
        host:'localhost',
        quiet: true,//减少输出log垃圾
        proxy: {},
        clientLogLevel: 'warning',//用于在inline模式下控制在浏览器打印bug的级别
        disableHostCheck: true,//或者可以使用public: 'local.kingsum.biz'
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: path.posix.join(
                        '/',
                        'index.html'
                    )
                }
            ]
        },
        compress : true,
        open : true,
        overlay:{ warnings: false, errors: true },//是否允许使用全屏覆盖方式显示编译错误 默认不允许
        publicPath:'/',
        watchOptions: {//可以控制多少秒检测时间变化
            poll: false
        }
    },
    module:{
        rules:[
            {
                test: /\.(scss|sass)$/,
                use: [
                  {
                    loader: 'vue-style-loader'
                  },
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 2//解决@import进来的css样式问题
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      implementation: require('dart-sass')
                    }
                  },
                  {
                    loader: 'postcss-loader'
                  }
                ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'../public/index.html'),
            inject: true
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static/js',
                ignore: ['.*']
            }
        ]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
})
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = '3000'
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://localhost:${port}`
                        ]
                    },
                    onErrors: (severity, errors) => {
                        if (severity !== 'error') return
                
                        const error = errors[0]
                        const filename = error.file && error.file.split('!').pop()
                        notifier.notify({
                            title: 'err',
                            message: severity + ': ' + error.name,
                            subtitle: filename || '',
                        })
                    }
                })
            )

            resolve(devWebpackConfig)
        }
    })
})