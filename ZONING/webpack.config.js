const path = require("path");
const webpack = require("webpack")
module.exports = {
    mode: "development",
    context: __dirname,
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.(glsl|vs|fs)$/,
                exclude: /node_modules/,
                loader: 'ts-shader-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins:[
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ],
    resolve: {
        fallback: {
            util: require.resolve("util/"),
            buffer: require.resolve("buffer/")
        }
    }
}