/* eslint-disable */

const path = require('path');

module.exports = {
    context: __dirname + "/src/",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "dist/bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react", "stage-0"],
                    plugins: ["transform-async-functions", "transform-runtime"]
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },

    entry: ["babel-polyfill", "./main.jsx"],

    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true,
        port: 8080,
        historyApiFallback: {
            index: "/"
        }
    }
};