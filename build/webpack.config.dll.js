const webpack = require('webpack');
const path = require('path');
const vendors = ['vue','vuex','vue-router','axios'];

module.exports = {
    mode:'production',
    entry:{
        vendor : vendors
    },
    output:{
        filename:'[name].[chunkhash:8].js',
        library:'[name]_[chunkhash:8]'
    },
    plugins:[
        new webpack.DllPlugin({
            path:'mainifest.json',
            name:'[name]_[chunkhash:8]',
            context:__dirname
        })
    ]
}