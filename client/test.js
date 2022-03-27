//58.152.94.212:8080
const proxy_check = require('proxy-check');

const proxy = {
  host: '58.152.94.212',
  port: 8080,
}

proxy_check(proxy).then(r => {
  console.log(r); // true
}).catch(e => {
  console.error(e); // ECONNRESET
});