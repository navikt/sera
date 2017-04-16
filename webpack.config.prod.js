const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        // './frontend/src/index.html',
        './frontend/src/stylesheets/index.less',
        './app'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'sera.js',
        publicPath: '/'
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?/,
                exclude: [/node_modules/, /stylesheets/],
                loaders: ['babel-loader'],
            },
            {
                test: /\.less$/,
                include: [__dirname, "src/stylesheets"],
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file-loader',
                options: {
                    name: 'frontend/build/images/aura-icons/hash].[ext]',
                },
            },
        ]
    }
};
