var log4js = require('log4js');
var fs = require('fs');
var {loggerConfig} = require('../config/logger.config');
var config = require('../config/config');

//加载配置文件
log4js.configure(loggerConfig);

var logUtil = {};
//调用预先定义的日志名称
var resLogger = log4js.getLogger("resLogger");
var errorLogger = log4js.getLogger("errorLogger");
var consoleLogger = log4js.getLogger();

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};

logUtil.logInfo = function (info) {
  if (info) {
    consoleLogger.info(formatInfo(info));
  }
};

logUtil.logSuccResponse = function(request) {
  if (Object.keys(request).length > 0) {
    resLogger.info(formatRequestRes(request));
  }
}

logUtil.logFailResponse = function(request) {
  if (Object.keys(request).length > 0) {
    errorLogger.error(formatRequestRes(request));
  }
}

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {
  
  if(!fs.existsSync(pathStr)){
    fs.mkdirSync(pathStr);
    console.log('createPath: ' + pathStr);
  }
}

var formatInfo = function (info) {
  var logText = new String();
  //响应日志开始
  logText += "\n" + "***************info log start ***************" + "\n";
  
  //响应内容
  logText += "info detail: " + "\n" + JSON.stringify(info) + "\n";
  
  //响应日志结束
  logText += "*************** info log end ***************" + "\n";
  
  return logText;
}

//格式化响应日志
var formatRes = function (ctx, resTime) {
  var logText = new String();
  //响应日志开始
  logText += "\n" + "*************** response log start ***************" + "\n";
  
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  
  //响应状态码
  logText += "response status: " + ctx.status + "\n";
  
  //响应内容
  logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";
  
  //响应日志结束
  logText += "*************** response log end ***************" + "\n";
  
  return logText;
}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
  var logText = new String();
  
  //错误信息开始
  logText += "\n" + "*************** error log start ***************" + "\n";
  
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  
  //错误名称
  logText += "err name: " + err.name + "\n";
  //错误信息
  logText += "err message: " + err.message + "\n";
  //错误详情
  logText += "err stack: " + err.stack + "\n";
  
  //错误信息结束
  logText += "*************** error log end ***************" + "\n";
  
  return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {
  
  var logText = new String();
  
  var method = req.method;
  //访问方法
  logText += "request method: " + method + "\n";
  
  //请求原始地址
  logText += "request originalUrl:  " + req.originalUrl + "\n";
  
  //客户端ip
  logText += "request client ip:  " + req.ip + "\n";
  
  //开始时间
  var startTime;
  //请求参数
  if (method === 'GET') {
    logText += "request query:  " + JSON.stringify(req.query) + "\n";
    // startTime = req.query.requestStartTime;
  } else {
    logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    // startTime = req.body.requestStartTime;
  }
  //服务器响应时间
  logText += "response time: " + resTime + "\n";
  
  return logText;
}

var formatRequestRes = function(request) {
  var logText = new String();
  //响应日志开始
  logText += "\n" + "***************info log start ***************" + "\n";
  
  logText += "request url: " + "\n" + request.url + "\n";
  logText += "request options: " + "\n" + JSON.stringify(request.options) + "\n";
  logText += "request response: " + "\n" + JSON.stringify(request.response) + "\n";
  
  
  //响应日志结束
  logText += "*************** info log end ***************" + "\n";
  
  return logText;
}

logUtil.init = function(app) {
  if (config.isDevelopment) {
    /**
     * 初始化log相关目录
     */
    //创建log的根目录'logs'
    if(loggerConfig.baseLogPath){
      confirmPath(loggerConfig.baseLogPath)
      //根据不同的logType创建不同的文件目录
      for(var i = 0, len = loggerConfig.appenders.length; i < len; i++){
        if(loggerConfig.appenders[i].path){
          confirmPath(loggerConfig.baseLogPath + loggerConfig.appenders[i].path);
        }
      }
    }
    
    app.use(async (ctx, next) => {
      //响应开始时间
      const start = new Date();
      //响应间隔时间
      var ms;
      try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
      } catch (error) {
        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
      }
    });
  }
}

module.exports = logUtil;
