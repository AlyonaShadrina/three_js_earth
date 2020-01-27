const path = require("path");

module.exports = {
    entry: {
        index: './src/pages/index.js',
        earth: './src/pages/earth/index.js',
        earthSmall: './src/pages/earthSmall/index.js',
        grid: './src/pages/grid/index.js',
        circle: './src/pages/circle/index.js',
    },
    mode: "development",
    output: {
        filename: "./[name].js",
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|glb)$/,
                use: ["file-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "src")],
        compress: true,
        port: 9000,
        watchContentBase: true,
        progress: true
    },
}