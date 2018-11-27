import qiniu from 'qiniu';
import qiniuconfig from './config/qiniu.config';
var ProgressBar = require('./utils/cmdprogress.js');


const fs = require('fs');
const path = require('path'); //解析需要遍历的文件夹
const accessKey = qiniuconfig.accessKey;
const secretKey = qiniuconfig.secretKey;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const AutoUpdate = {
  //读取文件夹下所有文件名称
  readDirPromise: async function (path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, function (err, files) {
        if (err) {
          reject(err)
        } else {
          resolve(files);
        }
      });
    })
  },
  //读取文件内容
  readFilePromise: async function (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString("utf-8"));
        }
      });
    })
  },
  //上传文件
  putFilePromise: async function (uploadToken, keyToOverwrite, path, putExtra, formUploader) {
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, keyToOverwrite, path, putExtra, function (respErr,
        respBody, respInfo) {
        if (respErr) {
          reject(respErr);
        } else {
          resolve(respInfo);
        }
      });
    })
  },
  //获取七牛某路径下的文件列表
  getFilelistPromise: async function (options, bucketManager) {
    return new Promise((resolve, reject) => {
      bucketManager.listPrefix(qiniuconfig.bucket, options, function (err, respBody, respInfo) {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode === 200) {
          var items = respBody.items;
          var delList = items.map(item => {
            return qiniu.rs.deleteOp(qiniuconfig.bucket, item.key);
          });

          if (delList.length > 0) {
            resolve(delList)
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  //批量上传七牛上的文件
  batchFilePromise: async function (delList, bucketManager) {
    return new Promise((resolve, reject) => {
      bucketManager.batch(delList, async function (err, respBody, respInfo) {
        if (err) {
          reject('删除失败' + err);
        } else {
          if (respInfo.statusCode === 200) {
            console.log('执行删除完毕!共删除文件' + respBody.length + '个');
            resolve(true)
          } else {
            resolve(false)
          }
        }
      });
    })
  },
  //主要上传逻辑
  uploadQNFile: async function (isref) {
    const filePath = path.resolve('./server/templet');
    let fileLists = await this.readDirPromise(filePath);
    let staticFileLists = await this.readDirPromise(filePath + '/static');
    staticFileLists.forEach(item => {
      fileLists.push('static/' + item);
    });
    var pb = new ProgressBar('上传进度', fileLists.length - 1);
    let successcount = 0;

    //const test = ['umi.js'];
    fileLists.map(async item => {
      if (item === 'static') {
        return false;
      }

      const keyToOverwrite = qiniuconfig.childPath + item;
      const options = {
        scope: qiniuconfig.bucket + ":" + keyToOverwrite
      }
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      const config = new qiniu.conf.Config();
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        config.zone = qiniu.zone.Zone_z0;
      }
      else {
      config.zone = qiniu.zone.Zone_z2;
      }
      var formUploader = new qiniu.form_up.FormUploader(config);
      var putExtra = new qiniu.form_up.PutExtra();
      const path = `./server/templet/` + item;
      const response = await this.putFilePromise(uploadToken, keyToOverwrite, path, putExtra, formUploader);
      if (response.statusCode === 200) {
        successcount++;
        //console.log(`进度${successcount}/${fileLists.length - 1};文件名：${item}`);
        pb.render({ completed: successcount, total: fileLists.length - 1, remark: item });
      } else {
        console.log("上传文件失败:" + item);
        console.log(response.data);
        console.log("..........................");
      }
      if (successcount === (fileLists.length - 1)) {
        console.log(`上传完毕${successcount}/${fileLists.length - 1}`);
        if (isref) {
          var cdnManager = new qiniu.cdn.CdnManager(mac);
          cdnManager.refreshDirs([`${qiniuconfig.successPath + '/' + qiniuconfig.childPath}`], function (err, respBody, respInfo) {
            if (err) {
              throw err;
            }
            if (respInfo.statusCode === 200) {
              var jsonBody = JSON.parse(respBody);
              if (jsonBody.code === 200) {
                console.log(`刷新目录：${qiniuconfig.successPath + '/' + qiniuconfig.childPath}/成功！剩余刷新次数：${jsonBody.dirSurplusDay}`)
              }
            }
          });
        } else {
          //不刷目录的话，就刷新index.html
          var cdnManager = new qiniu.cdn.CdnManager(mac);
          cdnManager.refreshUrls([`${qiniuconfig.successPath + '/' + qiniuconfig.childPath}index.html`], function (err, respBody, respInfo) {
            if (err) {
              throw err;
            }
            if (respInfo.statusCode === 200) {
              var jsonBody = JSON.parse(respBody);
              if (jsonBody.code === 200) {
                console.log(`刷新文件：${qiniuconfig.successPath + '/' + qiniuconfig.childPath}index.html成功！剩余刷新次数：${jsonBody.urlSurplusDay}`)
              }
            }
          });
        }


      }
    });
  },
  //执行
  run: async function (isref) {
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z2;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var options = {
      prefix: qiniuconfig.childPath,
    };
    var deleteList = await this.getFilelistPromise(options, bucketManager);
    if (deleteList.length > 0) {
      console.log('执行删除!')
      var isDelete = await this.batchFilePromise(deleteList, bucketManager);
      if (isDelete) {
        console.log('执行更新!')
        await this.uploadQNFile(isref);
      }
    } else {
      console.log('无删除项!')
      console.log('执行更新!')
      await this.uploadQNFile(isref);
    }

  }
}
AutoUpdate.run(false);