const APIV1 = '/api/v1'
const isMock = true;
const APIV2 = isMock ? APIV1 : '/api/v1/th';
const isDevelopment = process.env.NODE_ENV === 'development';
const apiDomain = isDevelopment ? 'http://localhost:9096' : '';
module.exports = {
  name: 'dva-umi-mobile',
  prefix: 'dvaumimobile',
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  isMock: isMock,
  isDevelopment,
  url: apiDomain ,// isDevelopment ? 'http://localhost:9096' : http://educlient.xxxxx.com',
  staticServer: 'http://cdn.xxxxx.com',
  api: {
    APIV2: APIV2,
    users: `${APIV1}/users`,
    weChat: {
      getUserInfo: '/api/wechat/getUserInfo'
    }
  },
}