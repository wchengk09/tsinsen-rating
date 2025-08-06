const http = require('http');

function parseCookies(cookieStr) {
  if (!cookieStr) return {};
  return cookieStr.split(';').reduce((cookies, item) => {
    const [key, val] = item.trim().split('=');
    cookies[key] = decodeURIComponent(val);
    return cookies;
  }, {});
}

const server = http.createServer((req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  console.log('Received cookies:', cookies);
  
  // 设置新Cookie
  res.setHeader('Set-Cookie', [
    'test=123; Max-Age=3600',
    'language=zh-CN; HttpOnly'
  ]);
  
  res.end('Cookie processed');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
