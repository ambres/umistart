import fs from 'fs';
import path from 'path';

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath, cb) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      cb(err, "");
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function(err, stats) {
          if (err) {
            cb(err, "");
          } else {
            const isFile = stats.isFile(); //是文件
            const isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              cb(undefined, filedir);
            }
            if (isDir) {
              fileDisplay(filedir, cb); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      });
    }
  });
}

export default {
  readAllFiles(filePath, cb) {
    return fileDisplay(filePath, cb);
  }
};