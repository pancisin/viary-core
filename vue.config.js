const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.module
      .rule("scss")
      .use("extract-css-loader")
      .loader(require("mini-css-extract-plugin").loader)
      .tap(options => {
        return {
          ...options,
          publicPath: "./"
        };
      });
  }
};
