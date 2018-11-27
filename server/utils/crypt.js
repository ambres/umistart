/**
 *      Author:Van Zheng
 *      E-Mail:zheng_jinfan@126.com
 *  Createtime:2018-08-20 17:30:00
 */

import crypto  from 'crypto';
import config  from '../config/config';

var crypt = {
  /**
   * md5加密
   * @param {*string} 需要加密的字符串 
   */
  md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  },
  /**
   * AES加密
   * @param {*string} data 
   * @param {*string} key 
   */
  aesEncrypt(data, key) {
    key = key || config.AESKEY;
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  /**
   * AES解密
   * @param {*string} encrypted 
   * @param {*string} key 
   */
  aesDecrypt(encrypted, key) {
    key = key || config.AESKEY;
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};

export default crypt;