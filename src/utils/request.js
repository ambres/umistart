import fetch from 'dva/fetch';

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
  const option = {
    method: options.method,
    mode: 'cors',
    body: options.params !== undefined && options.params !== null ? JSON.stringify(options.params) : undefined,
    headers: options.headers || {},
    credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin' //---
  }
  let response = null;
  try {
    response = await fetch(url, option);
    checkStatus(response);
  } catch (error) {
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
  return await response.json();
}

export default request;
/**
 *
 * @param {*} url
 * @param {*} options
 */
export async function get(url, options) {
  const params = options.params || {};
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
    headers: options.headers || {}
  })
}
/**
 *
 * @param {*} url
 * @param {*} options
 */
export async function post(url, options) {
  return await request({
    url: url,
    method: 'post',
    headers: options.headers || {},
    params: options.params || {}
  })
}