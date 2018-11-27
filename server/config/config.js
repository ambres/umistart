const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  // 设置上传文件大小最大限制，单位:MB ,
  maxFileSize: 6,
  // Session 过期时间  分钟
  sessionTimeOut: 24 * 60, // 一个月
  // 与后端交互的token私钥
  token_private_key: 'qyMZXTMIePOIvObrmASDsfasdasdaNscKilAPXPb',
  // 用于AES加密的key
  AESKEY: 'qyMZXTMIePOIvObW6mNscKilAPXPb#@!@',
  APIDomain: isDevelopment ? 'https://' : 'http://',
  miniName: isDevelopment ? 'api' : 'educlient',
  isDevelopment
} 