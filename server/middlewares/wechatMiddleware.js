import WeChat from '../sdk/wechat'
const wechat = new WeChat();

export default async(redisClient, ctx, next) => {
  switch (ctx.path) {
    // 获取OpenID
    case '/api/wechat/getOpenID':
      ctx.body = await wechat.getOpenId(ctx.query);
      break;
      // 验证服务器
    case '/api/wechat/validToken':
      ctx.body = wechat.checkSignature(ctx.query, 'wechat');
      break;
      // 获取用户信息
    case '/api/wechat/getUserInfo':
      const res = await wechat.getUserInfo(ctx.query);
      if (res.success) {
        redisClient.set((res.data.openid || 'openid'), JSON.stringify(res.data));
      }
      ctx.body = res;
      break;
    default:
      await next();
      break;
  }
}
