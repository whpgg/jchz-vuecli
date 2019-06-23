const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry:{
        main:path.resolve(__dirname,'../src/main.js')
    },
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'static/js/[name].js',
        publicPath:'/'
    },
    resolve: {
        alias: {
          vue$: 'vue/dist/vue.runtime.esm.js',
          '@src' : path.resolve(__dirname,'../src')
        },
        extensions: [
            '.js',
            '.vue'
        ]
      },
    module: {
        rules:[
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'cache-loader'
                    },
                    {
                        loader: 'thread-loader'//多线程
                    },
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            },
                        }
                    }
                ]
            },
            {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true//使用缓存目录
                    },
                    // 排除路径
                    exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                                limit: 3*1024,
                                fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ],
            },
            {
                test:/\.(jpe?g|png|gif|svg)$/i,
                loader:'image-webpack-loader',
                //此loader运行应该在其他loader之前用于图片优化
                enforce:'pre'
            },
            {
                test:/\.svg$/,
                loader:'svg-url-loader',
                options:{
                    limit:10*1024,
                    noquotes:true
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 300*1024,
                            fallback: {
                                    loader: 'file-loader',
                                    options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 3*1024,
                            fallback: {
                                    loader: 'file-loader',
                                    options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ],
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}