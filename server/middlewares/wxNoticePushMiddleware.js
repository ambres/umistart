import WeChat from '../sdk/wechat';
import request from '../utils/request';
import { NOTICEURL, APPID } from '../config/wechat.config';
import logUtil from '../utils/logger';

const WX_TEMPLATE_KEY = 'NoticeChannel';
const WX_TEMPLATE_DATA_KEY = 'NoticeTmp_Channel';
const SHORT_TIME_INTERVAL = 1 * 1000;
const LONG_TIME_INTERVAL = 1000 * 5 * 12;

const weChat = new WeChat();

let intervalTime = SHORT_TIME_INTERVAL;
let hasExcuted = false;
let intervalId = null;
let isHaveNotice = true;

const sendTemplateMsg = async (params, access_token) => {
  const res = await request({
    url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`,
    method: 'post',
    params,
    headers: { 'Content-Type': 'application/json' }
  });
  return res;
};

const getNoticeUrl = (data) => {
  if (!data.NoticeCallUrl) {
    if (data.NoticeCallUrl == '') {
      return NOTICEURL;
    }
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${data.NoticeCallUrl}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
  }
  else {
    return NOTICEURL;
  }
}
const pushWxNotice = async (ctx, redisClient, notice) => {
  let res = await weChat.getAccessToken(ctx, redisClient);
  let templateData = await redisClient.hgetAsync(WX_TEMPLATE_DATA_KEY, notice.Guid);
  templateData = JSON.parse(templateData || '[]');
  let data = {};
  templateData.map(item => {
    data[item.Name] = {
      value: item.Value,
      color: item.Color
    }
    return;
  })
  console.log(notice);
  let params = {
    touser: notice.ToOpenID,
    template_id: notice.TemplateId,
    url: getNoticeUrl(notice),
    data
  }
  let isNeedPush = false;
  //获取token失败
  if (res['err_code'] || res.success === false) {
    isNeedPush = true;
  } else {
    let accessToken = res['access_token'];
    res = await sendTemplateMsg(params, accessToken);
    //推送失败，将消息再存入redis队列中
    if (res['errcode'] || res.success === false) {
      isNeedPush = true;
    }
  }
  if (isNeedPush) await redisClient.lpushAsync(WX_TEMPLATE_KEY, JSON.stringify(notice));
  if (!isNeedPush) await redisClient.hdelAsync(WX_TEMPLATE_DATA_KEY, notice.Guid);
  return res;
}

const changeIntervalByResponse = (res, handler) => {
  if (!isHaveNotice && intervalTime === SHORT_TIME_INTERVAL) {
    clearInterval(intervalId);
    intervalTime = LONG_TIME_INTERVAL;
    setInterval(handler, intervalTime);
  } else if (intervalTime === LONG_TIME_INTERVAL) {
    clearInterval(intervalId);
    intervalTime = SHORT_TIME_INTERVAL;
    setInterval(handler, intervalTime);
  }
}

export default async (redisClient, ctx, next) => {
  const loop = async () => {
    try {
      let notice = await redisClient.lpopAsync(WX_TEMPLATE_KEY);

      if (notice) {
        notice = JSON.parse(notice);

        return await pushWxNotice(ctx, redisClient, notice);
      }

      let noticeLen = await redisClient.llenAsync(WX_TEMPLATE_KEY);

      isHaveNotice = noticeLen > 0;

      return { success: false };
    } catch (err) {
      logUtil.logError(ctx, err, '');
    }
  }
  if (!hasExcuted) {
    intervalId = setInterval(async () => {
      changeIntervalByResponse(await loop(), loop);
    }, intervalTime);
    hasExcuted = true;
  }

  await next();
}
