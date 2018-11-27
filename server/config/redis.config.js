import config from './config';

let redisConfig = {};

if (config.isDevelopment) {
  Object.assign(redisConfig, {
    host: '',
    password: ''
  });
} else {
  Object.assign(redisConfig, {
    host: '',
    password: ''
  });
}

export default redisConfig;


