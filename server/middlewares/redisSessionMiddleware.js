import redis from 'redis';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';

import redisConfig from '../config/redis.config';
import config from '../config/config';

// 过期时间 -- 毫秒
const timeOut = (config.sessionTimeOut || 30) * 60 * 1000;
/**
 * 配置session中间件
 */
export default (app) => {
  app.use(session({
    store: redisStore({
      client: redis.createClient(Object.assign(redisConfig, {}))
    }),
    // prefix: 'auth',
    ttl: timeOut,
    cookie: {
      maxAge: timeOut
    }
  }));
};
/**
 * 获取session
 * @param {*} ctx
 */
export const get = async(ctx) => ctx.session;
/**
 * 设置session
 * @param {*} ctx 上下文
 * @param {*} data 数据
 */
export const set = async(ctx, data) => {
  let session = ctx.session;
  session.data = data;
};
/**
 * 移除sessoin
 * @param {*} ctx 上下文
 */
export const remove = async(ctx) => {
  ctx.session = null;
};

/**
 * 重新生成session
 * @param {*} ctx 上下文
 * @param {*} data 数据
 */
export const regenerate = async(ctx, data) => {
  set(ctx, data);
  await ctx.regenerateSession();
  return get(ctx)
};
