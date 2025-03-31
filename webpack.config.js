const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        main: './script.js',
        styles: './styles.css'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].[contenthash].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'content',
                    to: 'content'
                },
                {
                    from: 'icons',
                    to: 'icons'
                },
                {
                    from: 'manifest.json',
                    to: 'manifest.json'
                }
            ]
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
            runtimeCaching: [
                {
                    urlPattern: /\/api\//,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 24 * 60 * 60 // 24 hours
                        }
                    }
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images-cache',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                        }
                    }
                },
                {
                    urlPattern: /content\//,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'content-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                        }
                    }
                }
            ]
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.API_URL': JSON.stringify(process.env.API_URL)
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `vendor.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    },
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
        contentBase: './public',
        hot: true,
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};