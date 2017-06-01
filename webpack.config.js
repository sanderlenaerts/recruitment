const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');

// Directory where the compiled will go: copy everything to dist folder
const DIST_DIR = path.resolve(__dirname, "dist")

// Where to find the entrance source code files
const SRC_DIR = path.resolve(__dirname, "src");

const config = {
    // Where to look for entries
    context: path.resolve(__dirname, SRC_DIR),
    entry:  {

        index:  [
            './app/index.js'
        ]
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
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
    },
    plugins: [
        new ExtractTextPlugin('./assets/css/styles.css'),
        
        
        new CopyWebpackPlugin(
            [
                 { 
                    from: SRC_DIR + '/index.html', 
                    to: DIST_DIR  
                 },
                 {
                     from: './app/assets/images',
                     to: './assets/images'
                 },
                 
            ]
        ),

        new AppCachePlugin({
            cache: [''],
            network: null,
            settings: ['prefer-online'],
            output: 'my-manifest.appcache'
        }),
    ]
}


module.exports = config;
