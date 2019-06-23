const autoprefixer = require('autoprefixer');
const postcssSprites = require('postcss-sprites');
module.exports = {
    plugins : [
        autoprefixer(),
        postcssSprites({spritePath:'./src/assets/img/'})
    ]
}