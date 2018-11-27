import * as loginService from "../services/login";
import router from "umi/router";
import { Toast } from "antd-mobile";
export default {
  namespace: "login",
  state: {
    text: "page work",
    list: [],
    userinfo: {},
    isSend: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        
      });
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const result = yield call(loginService.login, payload);
      if (result.success) {
        Toast.hide();
        Toast.success(result.message, 1);
        router.replace("/");
      } else {
        Toast.fail(result.message, 1);
      }
    },
    *sendSms({ payload }, { call, put }) {
      const result = yield call(loginService.sendsms, payload);
      Toast.hide();
      if (result.success) {
        Toast.success(result.message, 1);
        yield put({ type: "setIsSend", payload: true });
      } else {
        Toast.fail(result.message, 1);
      }
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setUserInfo(state, { payload }) {
      return { ...state, userinfo: payload.data };
    },
    setIsSend(state, { payload }) {
      return { ...state, isSend: payload };
    }
  }
};
