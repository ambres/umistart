
export function setLocalStorage(key, vaule) {
  clearLocalStorage(key);
  return localStorage.setItem(key, JSON.stringify(vaule));
}

export function getLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  return value;
}

export function clearLocalStorage(key) {
  return localStorage.removeItem(key);
}

 // 格式化带T时间
export function timeFormatting(time) {
  let date = new Date(time).toJSON();  
  let newdate = new Date(+new Date(date)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')    
  return newdate;
}
