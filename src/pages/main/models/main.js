export default {
  namespace: 'main',
  state: {
    text: '',
    list: [],
    toastLoading: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/main' || pathname === '/') {
          dispatch({ type: 'global/setTitle', payload: { text: "首页" } })
        }
      });
    }
  },
  effects: {},
  reducers: {},
};
