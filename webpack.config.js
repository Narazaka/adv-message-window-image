// @ts-check

module.exports = /** @type {import("webpack").Configuration} */ ({
    mode: process.env.NODE_ENV || "development",
    entry: "./frontend/index.tsx",
    output: {
        path: `${__dirname}/public`,
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    onlyCompileBundledFiles: true,
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: process.env.NODE_ENV === "production" ? "source-map" : "eval",
});
