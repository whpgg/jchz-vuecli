const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackManifest = require('webpack-manifest-plugin');
const HtmlInlinePlugin = require('html-webpack-inline-source-plugin');//内联runtime
//将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap tip:只能用在webpack4中
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//它将在Webpack构建过程中搜索CSS资产，并使用cssnano将其最小化。解决了提取-文本-webpack-plugin CSS复制问题。
const OptimizeCssnanoPlugin = require('optimize-css-assets-webpack-plugin');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const gizps = ['js', 'css'];
module.exports = merge(webpackConfig, {
    mode: 'production',
    output:{
        filename:'static/js/[name].[chunkhash:8].js',//不推荐hash
        chunkFilename:'static/js/[name].[chunkhash:8].js'
    },
    optimization: {
        runtimeChunk:true,//将runtime提取到公共文件中，这段用来兼容低版本
        splitChunks: {
            chunks:'all',
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/]/,
                    chunks: 'initial'
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        },
        minimizer:[new TerserPlugin({
            cache : true,
            terserOptions:{
                comments:false,
                compress:{//删除一些无用代码
                    unused:true,
                    drop_debugger:true,
                    drop_console:true,
                    dead_code:true
                }
            },
            parallel:true,//开启多线程
        })],//uglifyjs对es6支持不好
        concatenateModules:true//用户作用域提升，尽量把模块放到一个函数里执行
    },
    module: {
        rules: [
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
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
                NODE_ENV: 'production'
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'../public/index.html'),
            filename: path.resolve(__dirname, '../dist/index.html'),
            inlineSource:'runtime~.+\\.js',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        new HtmlInlinePlugin(),
        new OptimizeCssnanoPlugin(),//使用默认配置就好，他的cssnano默认配置已经无敌了
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].[contenthash:8].css'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static/js',
                ignore: ['.*']
            }
        ]),
        new CompressionWebpackPlugin({
            test: new RegExp(
                '\\.(' + gizps.join('|') + ')$'
            ),
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.DllReferencePlugin({
            manifest:require('../mainifest.json')
        }),
        new WebpackManifest()//方便你查找运行的文件
    ]
})