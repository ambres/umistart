import Koa from 'koa';
import koaBody from "koa-body";
import cors from 'koa2-cors';
import fs from 'fs';
import serve from 'koa-static';
import config from './config/config';
import { childPath } from './config/qiniu.config';
import redisService from './sdk/redis';
// Middlewares
import wechatMiddleware from './middlewares/wechatMiddleware';
import apiMiddleware from './middlewares/apiMiddleware';
import redisSessionMiddleware from './middlewares/redisSessionMiddleware';
import wxNoticePushMiddleware from './middlewares/wxNoticePushMiddleware';
import { get } from './utils/request';

//const redisClient = redisService.init();
const app = new Koa();

//log工具
const logUtil = require('./utils/logger');

logUtil.init(app);

// cookies key
app.keys = ['keys', 'mobile keys'];
if (config.isDevelopment) {
  // 跨域
  app.use(cors({
    credentials: true
  }));
}
// body
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: config.maxFileSize * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}));
// Session with redis
redisSessionMiddleware(app);
// 微信中间件
//app.use(wechatMiddleware.bind(this, redisClient));
// push wx template
//app.use(wxNoticePushMiddleware.bind(this, redisClient));
// API中间件
//app.use(apiMiddleware.bind(this, redisClient));
// static
if (config.isDevelopment) {
  //app.use(serve('./server/templet'));
}
// 渲染HTML
app.use(async ctx => {
  const readFilePromise = function (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString("utf-8"));
        }
      });
    })
  };
  const body = config.isDevelopment ?
    await get(`http://cdn.xxxx.com/${childPath}index.html`, {
      dataType: 'html'
    }, ctx) :
    await get(`http://cdn.xxxx.com/${childPath}index.html`, {
      dataType: 'html'
    }, ctx);
  ctx.body = body;
});
const port = process.env.PORT || 9096;
app.listen(port, () => {
  console.log(`Listened At http://localhost:${port}`);
});
