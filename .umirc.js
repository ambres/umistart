import { resolve } from 'path';
export default {
  hash: true,
  plugins: [
    ['umi-plugin-react', {
      dva: true,
      antd: true, // antd 默认不开启，如有使用需自行配置
      routes: {
        exclude: [
          /models/,
          /services/,
          /components/
        ],
        library: 'react',
      },
      dynamicImport: {
        webpackChunkName: true,
        // level: 2
      },
      dll: {
        exclude: [],
        include: ["dva", "dva/router", "dva/saga", "dva/fetch"],
      },
      polyfills: ['ie9', 'ie10', 'ie11'],
      hd: true,
      // pwa: true,
      hardSource: true,
      fastClick: true
    }],
  ],
  outputPath: './server/templet',
  alias: {
    components: resolve(__dirname, 'src/components'),
    utils: resolve(__dirname, 'src/utils'),
    services: resolve(__dirname, 'src/services'),
    models: resolve(__dirname, 'src/models'),
    themes: resolve(__dirname, 'src/themes'),
    images: resolve(__dirname, 'src/assets'),
    mock: resolve(__dirname, 'mock'),
  },
  devtool: false,
  publicPath: 'http://cdn.xxxx.com/ecclientstaticosspath/',
}
