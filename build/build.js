const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackpro = require('./webpack.prod');

let buildtype = process.argv.slice(2)[0] || 'development';

const spinner = ora('build for ' + buildtype +'...');

spinner.start();

rm(path.join(path.resolve(__dirname, '../dist'),'static'),err=>{
    if (err) throw err
    webpack(webpackpro,(err,stats)=>{
        spinner.stop()
        if (err) throw err
        process.stdout.write(
            stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + '\n\n'
        )

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(
            chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                    "  Opening index.html over file:// won't work.\n"
            )
        )
    })
})
