const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./build/main.js",
  output: {
    filename: "bundle.js"
  },
  plugins: [
    // new webpack.IgnorePlugin(/^dns$/),
    new webpack.IgnorePlugin(/^child_process$/)
  ],
  resolve: {
    alias: {
      "minecraft-protocol": path.resolve(
        __dirname,
        "node_modules/minecraft-protocol/src/index.js"
      ), // Hack to allow creating the client in a browser
      dns: path.resolve(__dirname, "dns.js"), // Hack to allow creating the client in a browser
      net: "net-browserify"
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        babylon: {
          chunks: "initial",
          test: /babylonjs/,
          filename: "babylon.js"
        }
      }
    }
  }
};
