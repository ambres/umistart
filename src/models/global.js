import * as globalService from '../services/global'
import router from 'umi/router';
import { setLocalStorage } from '../utils/method';
import { Toast } from 'antd-mobile';
import { getUnreadCount } from '../services/global';

const MAX_CHECKIN_DISTANCE = 500 //meter

export default {
  namespace: "global",
  state: {
    text: "Title",
    userInfo: {},
    bannerAll: [],
    menuAll: [],
    noReadCount: 0,
    menuSelect: 'home'
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query, search }) => {
        // 获取微信用户信息
        if (query.code !== undefined && query.state !== undefined) {
          Toast.loading('loading', 0, () => { }, true);
          let params = { code: query.code, state: query.state };
          params = query.state !== 123 ? Object.assign(params, { isNeedValidCode: false }) : params;
          dispatch({ type: 'fetch', payload: params });
        } else {
          if (pathname === '/main' || pathname === '/') {
            // dispatch({ type: 'getBannerAll' });
            // dispatch({ type: 'getMenuAll' });
            // dispatch({ type: 'getNoticeCount' });
          }
        }
      });
    }
  },
  effects: {
    * setTitle({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: payload });
    },
    * fetch({ payload }, { call, put }) {
      const result = yield call(globalService.getuser, payload);
      Toast.hide();
      if (result.success) {
        let params = { openid: result.data.openid };
        if (payload.hasOwnProperty('isNeedValidCode')) {
          params = Object.assign(params, { isNeedValidCode: false, phoneNum: payload.state });
        }
        const res = yield call(globalService.login, params);
        let dataInfo = {};
        if (res.success) {
          // router.replace('/');
          dataInfo = res.data;
          yield put({ type: 'getBannerAll' });
          yield put({ type: 'getMenuAll' });
          yield put({ type: 'getNoticeCount' });
        } else {
          router.replace('/login');
        }
        setLocalStorage('userInfo', Object.assign(dataInfo, result.data));
      } else {
        // alert('获取openid失败');
        console.log('获取openid失败.');
      }
    },
    * getBannerAll({ payload }, { call, put }) {
      const result = yield call(globalService.getBannerAll);
      if (result.success) {
        yield put({ type: 'setBannerAll', payload: result.data });
      } else {
        Toast.fail(result.message, 1);
      }
    },
    * getMenuAll({ payload }, { call, put }) {
      const result = yield call(globalService.getMenuAll);
      if (result.success) {
        yield put({ type: 'setMenuAll', payload: result.data });
      } else {
        Toast.fail(result.message, 1);
      }
    },
    * getNoticeCount({ payload }, { call, put }) {
      const result = yield call(getUnreadCount, payload);
      if (result.success) {
        yield put({ type: 'setNoticeCount', payload: result.data });
      } else {
        Toast.fail(result.message);
      }
    },
    *signin({ payload }, { call, put }) {
      let isFail = false;
      let errMessage = '';
      yield put({ type: 'setToastLoading', payload: true });
      const signInfoResult = yield call(globalService.getSignInInfo, payload);
      if (signInfoResult.success) {
        let { latitudeAndlongitude, courseRecordId, startTime, endTime } = signInfoResult.data;
        let deptLocaltionArr = (latitudeAndlongitude || '').split(',');

        if (deptLocaltionArr.length === 2 && typeof window !== "undefined" && typeof window.BMap !== "undefined") {
          try {
            var geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition(async function (r) {
              if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
                let currentLocation = new window.BMap.Point(Number(r.point.lng), Number(r.point.lat));
                let deptLocation = new window.BMap.Point(Number(deptLocaltionArr[1]), Number(deptLocaltionArr[0]));
                let distance = new window.BMap.Map().getDistance(currentLocation, deptLocation);

                if (distance <= MAX_CHECKIN_DISTANCE) {
                  const signInResult = await globalService.signIn({ courseRecordId, startTime, endTime });

                  if (signInResult.success) {
                    Toast.success(signInResult.messasge || '签到成功');
                  } else {
                    Toast.fail(`签到失败，原因：${signInResult.message}`)
                  }
                } else {
                  Toast.fail(`签到失败，原因：已超出签到范围,请到${MAX_CHECKIN_DISTANCE}米以内的范围重试`);
                }
              } else {
                alert('failed' + this.getStatus());
              }
            });
          } catch (err) {
            alert(`签到失败，原因：${err.message}`);
          }
        } else {
          isFail = true;
          errMessage = "发生错误，请确认网络连接正常后点击刷新重试";
        }
      } else {
        isFail = true;
        errMessage = signInfoResult.message;
      }
      yield put({ type: 'setToastLoading', payload: false });
      if (isFail) {
        Toast.fail(errMessage, 2, null, false);
      }
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setBannerAll(state, { payload }) {
      let arr = [];
      payload.map((item) => {
        if (item.isEnabled) {
          arr.push(item);
        }
        return null;
      })
      return { ...state, bannerAll: arr };
    },
    setMenuAll(state, { payload }) {
      let arr = [];
      payload.map((item) => {
        if (item.isEnabled) {
          arr.push(item);
        }
        return null;
      })
      return { ...state, menuAll: arr };
    },
    setNoticeCount(state, { payload }) {
      return { ...state, noReadCount: payload.noReadCount }
    },
    setToastLoading(state, { payload }) {
      return { ...state, toastLoading: payload }
    }
  }
};
