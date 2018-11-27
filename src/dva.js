import { message } from 'antd';

export function config() {
  return {
    onError(err) {
      err.preventDefault();
      message.error(err.message);
    },
    initialState: {
      global: {
        text: '佰平学生端',
        userInfo: {},
        bannerAll: [],
        menuAll: [],
      },
    },
  };
}
