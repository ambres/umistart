import redisConfig from '../config/redis.config';
import bluebird from 'bluebird';
import redis from 'redis';
import Utils from '../utils/common';
var loggerConfig = require('../config/logger.config');

const redisService = {
  init() {
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);

    const redisClient = redis.createClient(Object.assign(redisConfig, {}));
    const clientSub = redisClient.duplicate();
    const clientRead = clientSub.duplicate();

    redisClient.on("connect", function() {
      console.log('redis connected');
    });

    redisClient.on("error", function(err) {
      console.log("Error " + err);
    });
  
    clientSub.on("subscribe", function (channel, count) {});
  
    clientSub.on("message", function (channel, message) {
      if (message) {
        clientRead.multi().lpush("eduMobileClientLogs", `timestamp ${Utils.getDateString(new Date())} \n\n ${message}`)
          .ltrim("eduMobileClientLogs", 0, 5000).execAsync().then((res) => {});
      }
    });
  
    clientSub.subscribe(loggerConfig.channelForLogs);
    
    return redisClient;
  }
}

export default redisService;
