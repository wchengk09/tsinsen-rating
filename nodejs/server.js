const http = require('http');
const problem = require('./problem');
const login = require("./login");
const fs = require('fs');

function parseCookies(cookieStr) {
    if (!cookieStr) return {};
    return cookieStr.split(';').reduce((cookies, item) => {
      const [key, val] = item.trim().split('=');
      cookies[key] = decodeURIComponent(val);
      return cookies;
    }, {});
}

var mime={
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'woff2':'font/woff2'
};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', 'http://172.16.44.106:8000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, content-type'); // 添加 content-type
        res.setHeader('Access-Control-Allow-Credentials', true);
        
        if(req.method == "GET"){
            if(req.url=="/")req.url="/index.html";
            req.url=req.url.replace("/..","");
            var url="html"+req.url;
            console.log(url);
            fs.stat(url, (err, stats) => {
                if (err) {
                   res.writeHead(404);
                   return res.end('File not found');
                }
                var split_dot=url.split('.');
            
                res.writeHead(200, {
                   'Content-Type': mime[split_dot[split_dot.length-1]],
                   'Content-Length': stats.size
                });
            
                fs.createReadStream(url).pipe(res);
            });
            return;
        }

        console.log("req");

        try {
            req.json = JSON.parse(data);            
        } catch (error) {
            res.end("<meta charset='utf-8'>服务器繁忙，请稍后再试");
            return;
        }

        if(req.json.method=="login"){
            if(!req.json.username){res.writeHead(200);res.end("114514");return;}
            if(!req.json.password){res.writeHead(200);res.end("1919810");return;}

            var login_result=login.login(req.json.username,req.json.password);
            if(!login_result){
                res.setHeader('Set-Cookie', [
                    'username=; user_session=;',
                    'language=zh-CN;'
                ]);
                res.writeHead(200);
                res.end("用户名或密码错误");
                return;
            }else{
                res.setHeader('Set-Cookie', [
                    'username='+req.json.username+';',
                    'user_session='+login_result+';',
                    'language=zh-CN;'
                ]);
                res.writeHead(200);
                res.end("登录成功");
                return;
            }
        }else if(req.json.method=="change"){
            var cookies = parseCookies(req.headers.cookie);

            console.log(cookies);
            if(!cookies.username){res.writeHead(200);res.end("请登录！");return;}
            if(!login.check(cookies.username,cookies.user_session)){
                res.setHeader('Set-Cookie', [
                    'username=; user_session=;',
                    'language=zh-CN;'
                ]);
                res.writeHead(200);
                res.end("账号异常，请重新登录!");
                
                return;
            }
            req.json.username=cookies.username;
            problem.change(req,res);
            
        }else if(req.json.method=="get")res.writeHead(200),problem.get(req,res);
        else res.writeHead(404),res.end("我是奶龙！我是奶龙！我才是奶龙！");
    });
});

// 监听端口
const port = 8000;
server.listen(port,'0.0.0.0',  () => {
  console.log(`服务器正在监听端口 ${port}`);
});