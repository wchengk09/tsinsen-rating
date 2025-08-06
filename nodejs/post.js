const http = require('http');
const data = JSON.stringify({
   username: 'xhabc66' , 
   method : 'change',
   password : '12356'
});
const options = {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json' ,
    'Cookie': 'username=xhabc66; session=session_31010106135678340235143741' // 手动拼接cookie字符串
  }
};
const req = http.request('http://172.16.44.106:2236', options, (res) => {
    let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
});
req.write(data);
req.end();