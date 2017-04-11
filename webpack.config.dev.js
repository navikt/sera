const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'babel-polyfill',
        'webpack-hot-middleware/client',
        './frontend/src/stylesheets/index.less',
        './app'
    ],
    output: {
        path: path.join(__dirname, './frontend/build/'),
        filename: 'sera.js',
        publicPath: 'https://localhost:8443/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js?/,
                exclude: [/node_modules/, /styles/],
                loaders: ['babel-loader'],
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash].[ext]',
                },
            },
            {
                test: /\.less$/,
                include: [__dirname, "frontend/src/stylesheets"],
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}

        ]
    }

};
