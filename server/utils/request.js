/**
 *      Author:Van Zheng
 *      E-Mail:zheng_jinfan@126.com
 *  Createtime:2018-08-20 17:30:00
 */

import fetch from 'dva/fetch';
import config from '../config/config';
import crypt from './crypt';
import * as session from '../middlewares/redisSessionMiddleware';
import logger from './logger';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} [options] The options we want to pass to "fetch"
 * {
 *   url: user,
 *   method: 'get',
 *   data: params,
 *   headers:{}
 * }
 * {
 *      method: 'POST',
 *      mode: 'cors',
 *      body:JSON.stringify(tubState),
 *      headers:myHeaders
 *}
 * @return {object}           An object containing either "data" or "err"
 */

const request = async(options) => {
  const url = options.url;
  const dataType = options.dataType ? options.dataType : 'json';
  let body = null;
  if (options.params !== undefined && options.params !== null && options.params !== '') {
    body = typeof options.params === 'string' ? options.params : JSON.stringify(options.params);
  }
  let h = {};
  if (dataType === 'html') {
    h['Content-Type'] = 'text/html';
  }
  const option = {
    method: options.method,
    mode: 'cors',
    body,
    headers: Object.assign((options.headers || {}), h)
  }

  let response = null;
  try {
    response = await fetch(url, option);
    checkStatus(response);
  } catch (error) {
    logger.logFailResponse({ url, option, response: error });

    const res = error.response;
    if (res !== undefined) {
      return {
        success: false,
        message: '服务器发生错误，请联系管理员. logs:' + res.statusText,
        statusCode: res.status
      };
    }
    return {
      success: false,
      message: '服务器发生错误，请联系管理员. logs:' + error.message,
      statusCode: 500
    };
  }
  const res = dataType === 'html' ? await response.text() : await response.json();
  if (dataType === 'json') {
    logger.logInfo({ url, option, res });
  }

  return res;
}

export default request;

/**
 *
 * @param {*} url
 * @param {*} options
 */
export async function get(url, options, ctx) {
  options = options || {};
  let params = typeof options.params === 'string' ? JSON.parse(options.params || '{}') : options.params;
  params = params || {};
  if (options.dataType === 'html') {
    params.version = new Date().getTime();
  } else {
    const info = await loginInfo(ctx);
    if (info.isLogin) {
      params.studentId = info.user.studentId;
      params.userId = info.user.studentId;
    }
  }
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  return await request({
    url: url,
    method: 'get',
    headers: Object.assign((options.headers || {}), await getHeaders(ctx)),
    dataType: options.dataType || 'json'
  });
}
/**
 * Post请求
 * @param {*} url
 * @param {*} options
 * @param {*http.request} req
 */
export async function post(url, options, ctx) {
  options = options || {};
  let params = typeof options.params === 'string' ? JSON.parse(options.params || '{}') : options.params;
  params = params || {};
  const info = await loginInfo(ctx);
  if (info.isLogin) {
    params.studentId = info.user.studentId;
    params.userId = info.user.studentId;
  }
  return await request({
    url: url,
    method: 'post',
    params,
    headers: Object.assign((options.headers || {}), await getHeaders(ctx))
  })
}
/**
 * 获取请求头
 * @param {*} req
 */
async function getHeaders(ctx) {
  const { req } = ctx;
  let user = undefined;
  const s = await session.get(ctx);
  if (s !== undefined) {
    user = s.data;
  }
  // 获取时间戳
  function getTimestamp() {
    return new Date().getTime();
  }
  //获取随机数
  function getRandom(num) {
    let res = "";
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (var i = 0; i < num; i++) {
      const id = Math.ceil(Math.random() * 9);
      res += chars[id];
    }
    return res;
  }
  // GET Signature
  function getSignature(user) {
    if (user === undefined) {
      user = {
        staffId: '80f3b7c5-da2c-406c-a0d8-7e523b371642',
        signToken: '4847a513-d551-465f-81db-567a69513eea'
      }
    }
    const { staffId, signToken } = user;
    const timestamp = getTimestamp();
    const nonce = getRandom(9);
    const staffid = staffId;
    const st = signToken;
    const private_key = config.token_private_key; //私钥
    const signStr = timestamp + nonce + staffid + st + private_key;
    const signature = crypt.md5(signStr);
    return {
      timestamp,
      nonce,
      staffid,
      signature
    };
  }
  // GET clientIp
  function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket || {}).remoteAddress;
  };
  const token = getSignature(user);
  return {
    'Content-Type': 'application/json',
    'staffid': token.staffid,
    'timestamp': token.timestamp,
    'nonce': token.nonce,
    'signature': token.signature,
    'clientIp': getClientIp(req)
  };
}

/**
 * 获取登录信息
 * @param {*} ctx
 */
async function loginInfo(ctx) {
  // 获取用户信息
  let sdata = await session.get(ctx);
  // 是否已登录
  const isLogin = sdata !== undefined && sdata.data !== undefined;
  return {
    isLogin,
    user: sdata.data
  };
}
