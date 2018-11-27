import { post } from 'utils/request';
import {url} from 'utils/config';

export async function getSignInInfo(params) {
  return post(`${url}/api/myinfo/getSignInInfo`, {params});
}

export async function signIn(params) {
  return post(`${url}/api/myinfo/signIn`, {params});
}

