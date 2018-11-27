import { get, post } from 'utils/request';
import config from 'utils/config';

const { api } = config;
const { weChat } = api;
const { getUserInfo } = weChat;

const url = config.url;

export async function getuser(params) {
  return get(url + getUserInfo, {
    params
  });
}

export async function login(params) {
  return post(url + '/api/account/login', {
    params
  });
}

export async function getBannerAll(params) {
  return await get(url + '/api/banner/getall', {
    params
  });
}

export async function getMenuAll(params) {
  return await get(url + '/api/menu/getall', {
    params
  });
}

export async function getUnreadCount(params) {
  return await get(`${url}/api/ecnotice/getmynoreadedcount`, {params});
}

export async function getSignInInfo(params) {
  return post(`${url}/api/myinfo/getSignInInfo`, {params});
}

export async function signIn(params) {
  return post(`${url}/api/myinfo/signIn`, {params});
}
