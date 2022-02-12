const zlib = require("zlib");
const CompressionPlugin = require("compression-webpack-plugin");

// craco.config.js
module.exports = {
    style: {
        postcss: {
            plugins: { tailwindcss: {}, autoprefixer: {}, }
        },
    },
    webpack: {
        plugins: {
            add: [
                new CompressionPlugin({
                    filename: "[path][base].gz",
                    algorithm: "gzip",
                    test: /\.(js|css|html|svg|png|json)$/,
                    threshold: 10240,
                    minRatio: 0.8,
                }),
                new CompressionPlugin({
                    filename: "[path][base].br",
                    algorithm: "brotliCompress",
                    test: /\.(js|css|html|svg|png|json)$/,
                    compressionOptions: {
                        params: {
                            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                        },
                    },
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false,
                }),
            ],
        },
    },
};
