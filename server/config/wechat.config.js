import config from './config';

let app_id = '';
let callback = '';
let weChatConfig = {};

if (config.isDevelopment) {
  app_id = '';
  callback = '';
  Object.assign(weChatConfig, {
    // 微信APPID
    APPID: app_id,
    // 微信APPSECRET
    APPSECRET: '',
    NOTICEURL: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${callback}/notice&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
  });
} else {
  app_id = '';
  callback = '';
  Object.assign(weChatConfig, {
    // 微信APPID
    APPID: app_id,
    // 微信APPSECRET
    APPSECRET: '',
    NOTICEURL: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${callback}/notice&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
  });
}
export default weChatConfig;