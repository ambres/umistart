const Utils = {
  createNonceStr: () => {
    return Math.random().toString(36).substr(2, 15);
  },

  createTimestamp: () => {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  
  raw: (args) => {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });
    
    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  },
  
  /**
   * @synopsis 签名算法
   *
   * @param jsapi_ticket 用于签名的 jsapi_ticket
   * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
   *
   * @returns
   */
  sign: (jsapi_ticket, url) => {
    var ret = {
      jsapi_ticket: jsapi_ticket,
      nonceStr: Utils.createNonceStr(),
      timestamp: Utils.createTimestamp(),
      url: url
    };
  
    var string = Utils.raw(ret),
        jsSHA = require('jssha'),
        shaObj = new jsSHA("SHA-1", 'TEXT');
    shaObj.update(string);
    ret.signature = shaObj.getHash('HEX');
    return ret;
  },
  
  getDateString: (date) => {
    if (date instanceof Date) {
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    
    return date;
  }
}

export default Utils
