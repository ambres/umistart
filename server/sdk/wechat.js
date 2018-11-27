import crypto from 'crypto';
import { APPID, APPSECRET } from '../config/wechat.config';
import request, {get, post } from '../utils/request';

/**
 *
 */
class WeChatSDK {
  // 检查签名
  checkSignature(query, token) {
    const { signature, timestamp, nonce, echostr } = query;
    const shasum = crypto.createHash('sha1');
    const arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    return shasum.digest('hex') === signature ? echostr : '';
  };
  /**
   * 获取OpenId
   * @param {*String} code
   */
  async getOpenId(query) {
    const res = await request({
      url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${query.code}&grant_type=authorization_code`,
      method: 'get',
    });
    const flag = res.errcode === undefined;
    return {
      success: flag,
      message: flag ? '获取成功' : JSON.stringify(res),
      data: res
    }
  };
  /**
   * 获取用户信息
   * @param {*Object} query
   */
  async getUserInfo(query) {
    // get token
    const token = await request({
      url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${query.code}&grant_type=authorization_code`,
      method: 'get',
    });
    if (token.errcode !== undefined) {
      return {
        success: false,
        message: '获取失败',
        data: ''
      }
    }
    const res = await request({
      url: `https://api.weixin.qq.com/sns/userinfo?access_token=${token.access_token}&openid=${token.openid}&lang=zh_CN`,
      method: 'get',
    });
    const flag = this.isResponseSuccess(res);
    return {
      success: flag,
      message: flag ? '获取成功' : JSON.stringify(res),
      data: res
    };
  };
  /**
   * 获取access_token
   */
  async getAccessToken(ctx, redisClient) {
    let accessTokenKey = `Token_BP`;
    let isNeedRequest = false;
    let access_token = '';
    
    if (accessTokenKey) {
      access_token = await redisClient.getAsync(accessTokenKey);
      
      if (!access_token) isNeedRequest = true;
    } else {
      isNeedRequest = true;
    }
    
    if (isNeedRequest) {
      let options = {
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
        method: 'get'
      }
      const res = await request(options);
  
      const flag = this.isResponseSuccess(res);
      
      if (flag) {
        redisClient.setAsync(accessTokenKey, res['access_token'], 'EX', res['expires_in']);
      }
      return res;
    }
    
    return {access_token};
  };
  
  async getTicket (ctx, redisClient, access_token) {
    let ticketKey = `jsapi_ticket_BP`;
    let isNeedRequest = false;
    let ticket = '';
  
    if (ticketKey) {
      ticket = await redisClient.getAsync(ticketKey);
    
      if (!ticket) isNeedRequest = true;
    } else {
      isNeedRequest = true;
    }
  
    if (isNeedRequest) {
      let options = {
        url: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,
        method: 'get'
      }
      
      const res = await request(options);
  
      if (res.errcode == 0 && res.errmsg == 'ok') {
        redisClient.setAsync(ticketKey, res['ticket'], 'EX', res['expires_in']);
      }
      return res;
    }
  
    return {ticket};
  };
  
  /**
   * 是否响应成功
   * @param {*} res
   */
  isResponseSuccess(res) {
    return res.errcode === undefined;
  }
}


export default WeChatSDK;
