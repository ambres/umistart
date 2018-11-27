import request, {get, post } from 'utils/request';
import config from 'utils/config';

const { api } = config;
const { weChat } = api;
const { getUserInfo } = weChat;
export async function getuser(params) {
  return await get(getUserInfo, {
    params
  });
}

export async function login(params) {
  return await post(`${config.url}/api/account/login`, {
    params
  });
}

export async function sendsms(params) {
  return await get(`${config.url}/api/account/sendsms`, {
    params
  });
}