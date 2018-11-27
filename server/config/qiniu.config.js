

const isDevelopment = process.env.NODE_ENV === 'development';

let config = {
  accessKey: '',
  secretKey: '',
  bucket: '',                                         // 七牛的文件目录名
  successPath: '',                       // 成功后的路径 
  childPath: 'ecclientstaticosspath/'
}
if (isDevelopment) {
  config = {
    accessKey: '',
    secretKey: '',
    bucket: '',                                         // 七牛的文件目录名
    successPath: '',                       // 成功后的路径 
    childPath: 'ecclientstaticosspath/'
  }
}
export default config;


