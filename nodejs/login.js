const fs = require('fs');

user_json={};

function init()
{
    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
          console.error('读取文件时发生错误:', err);
          return;
        }
        user_json=JSON.parse(data);
        console.log("read user data");
    });
}

async function output(data)
{
    data=JSON.stringify(data);
    fs.writeFile('user.json', data, (err) => {
        if (err) throw err;
        console.log('数据已成功写入文件');
    });
}

init();
// setInterval(init,1000);

session={};

module.exports.check=function(username,password){
    if(!session[username])return false;
    if(session[username].password!=password)return false;
    return true;
}

module.exports.login=function(username,password){
    if(!user_json[username])return false;
    if(user_json[username].password!=password)return false;
    var new_session="session_";
    for(var i=0;i<24;i++)new_session+=(10*Math.random()).toFixed(0);
    session[username]={};
    session[username].password=new_session;
    if(session[username].outtime)clearTimeout(session[username].outtime);
    console.log("set",username,new_session);
    session[username].outtime=setTimeout(function(){
        session[username].password=undefined;
        console.log("clear",username);
    },1200000);
    return new_session;
}
