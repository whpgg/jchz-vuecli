module.exports = {
    presets:[
        [
            "@babel/preset-env",
            {"useBuiltIns":"usage","corejs":2,"targets":{}}
        ]
    ],
    plugins: [
       '@babel/plugin-syntax-dynamic-import',
       [
            "@babel/plugin-transform-runtime",
            {
                "regenerator":false
            }
       ]
    ]
}