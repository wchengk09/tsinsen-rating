const fs = require('fs');

problem_json={};

function init(data)
{
    fs.readFile('result.json', 'utf8', (err, data) => {
        if (err) {
          console.error('读取文件时发生错误:', err);
          return;
        }
        problem_json=JSON.parse(data);
        console.log(problem_json);
    });
}

async function output(data)
{
    data=JSON.stringify(data,null,4);
    fs.writeFile('result.json', data, (err) => {
        if (err) throw err;
        console.log('数据已成功写入文件');
    });
}

init();

module.exports.change=function(req,res){
    if(!req.json.username){res.end("请登录！");return;}
    if(!req.json.difficult){res.end("请填写难度！");return;}
    if(!req.json.quality){res.end("请填写质量！");return;}
    req.json.difficult=Number(req.json.difficult);
    req.json.quality=Number(req.json.quality);
    if(req.json.difficult<711||req.json.difficult>3510){res.end("难度需在 800 ~ 3500 之间！");return;}
    if(req.json.quality<=0||req.json.quality>5){res.end("质量需在 0 ~ 5 之间！");return;}
    if(!req.json.problem){res.end("鸡你太美！");return;}
    if(!problem_json[req.json.problem]){res.end("你干嘛～～嗨嗨～～诶坳！");return;}
    
    req.json.quality=req.json.quality.toFixed(2);
    console.log(req.json);
    var IP=req.socket.remoteAddress;
    problem_json[req.json.problem].comment[req.json.username]={"IP":IP,"difficult":req.json.difficult,"quality":req.json.quality};
    output(problem_json);
    res.end("您的评价已提交");
}

var pid=1;

module.exports.get=function(req,res){
    
    var result=[];
    for(problem in problem_json){
        var comment=problem_json[problem].comment;
        var d=0,q=0,cnt=0;
        for(user in comment)d+=Number(comment[user].difficult),q+=Number(comment[user].quality),cnt++;
        if(cnt>0)d/=cnt,q/=cnt;
        else d='?',q='?';
        pid=pid+1;
        result.push({name:problem,ord:pid,id:problem_json[problem].id,date:problem_json[problem].date,difficult:d,quality:q,class:problem_json[problem].class});
    }
    console.log(result);
    res.end(JSON.stringify(result));
}
