module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
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
  }
};

