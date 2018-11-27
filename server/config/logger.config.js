var path = require('path');
var config = require('./config');
var redisConfig = require('./redis.config');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');

//错误日志目录
var errorPath     = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath  = baseLogPath + errorPath + "/" + errorFileName;
//var errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志目录
var responsePath     = "/response";
//响应日志文件名res
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath  = baseLogPath + responsePath + "/" + responseFileName;
//var responseLogPath = path.resolve(__dirname, "../logs/response/response");

var channelForLogs = "db0";

var devLoggerConfig = {
  //日志格式等设置
  appenders:
     {
       "rule-console": {"type": "console"},
       "errorLogger":  {
         "type":                 "dateFile",
         "filename":             errorLogPath,
         "pattern":              "-yyyy-MM-dd-hh.log",
         "alwaysIncludePattern": true,
         "encoding":             "utf-8",
         "maxLogSize":           1000,
         "numBackups":           3,
         "path":                 errorPath
       },
       "resLogger":    {
         "type":                 "dateFile",
         "filename":             responseLogPath,
         "pattern":              "-yyyy-MM-dd-hh.log",
         "alwaysIncludePattern": true,
         "encoding":             "utf-8",
         "maxLogSize":           1000,
         "numBackups":           3,
         "path":                 responsePath
       },
     },
  //供外部调用的名称和对应设置定义
  categories:    {
    "default":     {"appenders": ["rule-console"], "level": "all"},
    "resLogger":   {"appenders": ["resLogger"], "level": "info"},
    "errorLogger": {"appenders": ["errorLogger"], "level": "error"},
    "http":        {"appenders": ["resLogger"], "level": "info"}
  },
  "baseLogPath": baseLogPath
}

var prodLoggerConfig = {
  appenders: {
    redis: { type: '@log4js-node/redis', channel: channelForLogs, host: redisConfig.host, pass: redisConfig.password}
  },
  categories: {
    "default":     {"appenders": ["redis"], "level": "all"},
    "resLogger":   {"appenders": ["redis"], "level": "info"},
    "errorLogger": {"appenders": ["redis"], "level": "error"},
    "http":        {"appenders": ["redis"], "level": "info"}
  }
}

module.exports       = {
  channelForLogs,
  loggerConfig: config.isDevelopment ? devLoggerConfig : prodLoggerConfig
};
