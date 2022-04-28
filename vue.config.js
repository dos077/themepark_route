const { defineConfig } = require('@vue/cli-service');
// const WorkerPlugin = require('worker-plugin');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/themepark_route/'
    : './', /*
  configureWebpack: {
    plugins: [
      new WorkerPlugin(),
    ],
  }, */
});
