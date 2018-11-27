import * as session from '../middlewares/redisSessionMiddleware'
import { get, post } from '../utils/request';
import {sign} from '../utils/common';
import config from '../config/config';
import WeChat from '../sdk/wechat';
import { APPID } from '../config/wechat.config';
import logUtil from '../utils/logger';
const wechat = new WeChat();

export default async (redisClient, ctx, next) => {
  let result;
  // 获取用户信息
  let user = await session.get(ctx);
  // 是否已登录
  const isLogin = user !== undefined && user.data !== undefined;
  // 请求地址
  let requestUrl = `${config.APIDomain}${ctx.path}`;
  requestUrl = requestUrl.replace('/api/', `/${config.miniName}/`);
  switch (ctx.path) {
    case '/MP_verify_Ty2DqJ.txt':
      ctx.body = 'Ty2DqJLtJfBX6';
      break;
    // 登录
    case '/api/account/login':
      result = await post(requestUrl, {
        params: ctx.request.body
      }, ctx);
      if (result.success) {
        await session.set(ctx, result.data);
      }
      ctx.body = result;
      break;
    // 注销
    case '/api/account/logout':
      result = await get(requestUrl, {
        params: {
          staffId: isLogin ? user.data.staffId : 'notLogin'
        }
      }, ctx);
      if (result.success) {
        session.remove(ctx);
      }
      ctx.body = result;
      break;
    case '/api/publicinfo/getpublicinfo':
      if (isLogin) {
        const result = await redisClient.getAsync('publicInfo');
        
        ctx.body = {success: true, message: '获取成功', statusCode: 200, data: result}
      } else {
        ctx.body = {success: false, message: '未登录'};
      }
      break;
    case '/api/getWXConfig':
      try {
        let res = await wechat.getAccessToken(ctx, redisClient);
        let isFail = false;
        
        if (res['access_token']) {
          const {access_token}  = res;
          
          res = await wechat.getTicket(ctx, redisClient, access_token);
  
          const {ticket} = res;
  
          if (access_token && ticket) {
            ctx.body = {
              success: true,
              message: '获取成功',
              data: Object.assign({}, sign(ticket, ctx.request.body.url), {appId: APPID})
            };
          } else {
            isFail = true;
          }
        } else {
          isFail = true;
        }
        
        if (isFail) {
          ctx.body = {
            success: false,
            message: '获取微信配置信息失败',
            data: null
          }
        }
      } catch(err) {
        logUtil.logError(ctx, err, '');
      }
      break;
    default:
      if (ctx.path.indexOf('/api/') !== -1) {
        switch (ctx.method.toLowerCase()) {
          case 'post':
            ctx.body = await post(requestUrl, { params: ctx.request.body }, ctx);
            break;
          default:
            ctx.body = await get(requestUrl, { params: ctx.query }, ctx);
            break;
        }
      } else {
        await next();
      }
      break;
  }
}
