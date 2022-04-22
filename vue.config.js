const { defineConfig } = require('@vue/cli-service');
// const WorkerPlugin = require('worker-plugin');

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
  ], /*
  configureWebpack: {
    plugins: [
      new WorkerPlugin(),
    ],
  }, */
});
