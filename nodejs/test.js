const http = require('http');
const fs = require('fs');

json=[];

function init(data)
{
    fs.readFile('test.json', 'utf8', (err, data) => {
        if (err) {
          console.error('读取文件时发生错误:', err);
          return;
        }
        json=JSON.parse(data);
        console.log(json);
    });
}

async function output(data)
{
    fs.writeFile('test.json', data, (err) => {
        if (err) throw err;
        console.log('数据已成功写入文件');
    });
}

init();

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, content-type'); // 添加 content-type
        res.writeHead(200);

        var jsonData,id;
        try {
            jsonData = JSON.parse(data);
            console.log(jsonData);
            req.method=jsonData.method;
            console.log(req.method);
            id=jsonData.id;
            
        } catch (error) {}


        if(req.method=='add1'){
            json[id].prob.push(jsonData);
            console.log(json);
        }            
        else if(req.method=='clear1')json[id].prob=JSON.parse('[]');
        else if(req.method=='update1')json[id].name=jsonData.name;
        else if(req.method=='check')
        {
            console.log(jsonData.answer)
            var ans=jsonData.answer;
            var point=0;
            for(v=0;v<ans.length;v++)
            {
                if(!json[id].prob[v].point[(ans[v])])continue;
                console.log(json[id].prob[v].point[(ans[v])]);
                point+=Number(json[id].prob[v].point[(ans[v])]);
                console.log(point);
            }
            res.end(point.toString());
            return;
        }
        else if(req.method=='pass'){if(jsonData.password==json[id].password)res.end("ok");else res.end("fail");return;}
        else if(req.method=='get'){res.end(JSON.stringify(json[jsonData.id]));return;}
        else if(req.method=='create'){json[jsonData.id]=jsonData;json[jsonData.id].prob=Array();res.end("edit.html?id="+jsonData.id);return;}
        else {res.end("[something is wrong.please try later]");return;}
        
        output(JSON.stringify(json));
        res.end(JSON.stringify(json));
        //
        //jsonData["method"]=null;
        
    });
});

// 监听端口
const port = 2236;
server.listen(port, () => {
  console.log(`服务器正在监听端口 ${port}`);
});