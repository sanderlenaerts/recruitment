const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Directory where the compiled will go: copy everything to dist folder
const DIST_DIR = path.resolve(__dirname, "dist")

// Where to find the entrance source code files
const SRC_DIR = path.resolve(__dirname, "src");

const config = {
    // Where to look for entries
    context: path.resolve(__dirname, SRC_DIR),
    entry: {
        index:  './app/index.js'
    },
       
    // Where to store our compiled product
    output: {
        path: path.resolve(__dirname, DIST_DIR, 'app'),
        filename: '[name].bundle.js',
        // To tell webpack dev server where our product is located
        publicPath: '/app/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: SRC_DIR,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-2']
                    }
                }]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                 { 
                    from: SRC_DIR + '/index.html', 
                    to: DIST_DIR  
                 }
            ]
        )
    ]
}


module.exports = config;
