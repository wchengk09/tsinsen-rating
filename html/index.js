function parseCookies(cookieStr) {
    if (!cookieStr) return {};
    return cookieStr.split(';').reduce((cookies, item) => {
      const [key, val] = item.trim().split('=');
      cookies[key] = decodeURIComponent(val);
      return cookies;
    }, {});
  }

var problemData, prevClass=2;
var array=[0,0,0];


function vote(problem) {
    console.log(problemData[problem]);  
    problem=(problemData[problem]);
    var modal = document.createElement("div");
    // let data = res;
    // console.log(data);
    var modalHTML = /*html*/`
    <div class="ui modal" id="voteModal" style="width:600px" >
        <i class="inside close icon"></i>
        <div class="header">
            <span id="voteModalTitle">Vote - <a href="">${problem.name}</a></span>
        </div>
        <div class="content">
            <form class="ui form" id="voteForm">
                <!-- <div class="field">
                    <label>描述：From [to be update]；[to be update]</label>
                </div> -->

                
                    <div class="field">
                        <label>难度：</label>                        
                        <input type="text" placeholder="800-3500" value="" id="diff">
                    </div>
                    <br>
                    <div class="field">
                        <label>质量：<a class="" type="button" onclick="$('#qual').rating('update', 0.0001);">(点击以设为 0)</a></label>
                        <input type="text" placeholder="1-5" value="5" id="qual">
                    </div>
                
                <!-- <div class="field">
                    <label>评论：</label>
                    <textarea rows="5" id="comment">[to be update]</textarea>
                </div> -->
            </form>
        </div>
        <div class="actions">
            <div class="ui toggle checkbox">
                <input type="checkbox" id="public">
                <label for="public">公开评分</label>
            </div>
            <button id="voteModalSubmit" class="ui primary button">提交</button>
        </div>
    </div>
    `;
    modal.style.width="600px";
    document.body.innerHTML+=modalHTML;//.appendChild(modal);
        // console.log(modal);
    $('#voteModal').modal('show');
        // destroy on hide
    $('#voteModal').modal({
        onHidden: function () {
            $('#voteModal').remove();
        }
    })
    $('#voteForm').form({
        fields: {
            diff: {
                identifier: 'diff',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入难度'
                    }
                ]
            },
            qual: {
                identifier: 'qual',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入质量'
                    },
                    {
                        type: 'decimal[0..5]',
                        prompt: '质量范围为 0-5'
                    }
                ]
            }
        },
        inline: true,
        on: 'blur'
    });
    $('#qual').rating({ 'showClear': false, 'showCaption': false, 'size': 'sm' });
    $('#voteModalSubmit').click(function (event) {
        var OJ="AT";
        const radios = document.getElementsByName("OJ");
        for (let radio of radios) {
            if (radio.checked) {
                OJ=radio.value;
                break;
            }
        }
        var diff = parseInt($('#diff').val());
        var qual = parseFloat($('#qual').val());
        var name = $('#name').val();
        if(OJ=="AT"){
            diff=ATtoCF(diff);
        }
        if (!qual) {
            qual = 0
        }
        if (isNaN(diff) || isNaN(qual)) {
            alert("整点阳间输入的吧。");
            return;
        }
        var comment = $('#comment').val();
        if (OJ == "CF" && (diff < 800 || diff > 3500)){
            alert("输入不合法");
            return;
        }
        if(qual < 0 || qual > 5){
            alert("输入不合法");
            return;
        }

        fetch("/api",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', 
            body:JSON.stringify({
                method:"change",
                difficult:diff,
                quality:qual,
                name:name,
                problem:problem.name
            })
        }).then(response => response.text())
        .then(data => {
            alert(data);
            console.log(data);
            if(data=="您的评价已提交")console.log("刷新"),location.href=location.href.split('#')[0].split('?')[0];
            var cookie=parseCookies(document.cookie);
            if(!cookie.username)document.getElementsByClassName("right menu")[0].getElementsByTagName("a")[0].innerHTML="Login";
            else document.getElementsByClassName("right menu")[0].getElementsByTagName("a")[0].innerHTML="Logout";
            
        }).catch(error => console.error('Error:', error));

    });
}

const classname=["这是彩蛋","2025 暑假 - Mashups (Legacy)","2025 暑假 - SDSZ 互测 & 近代联考","2025 暑假 - Mashups","2025 秋 - 2023 NOI 联考"];

function init(classid){
    $(".problem").hide();
    $(".problem"+classid.toString()).show();
    $("#typename").html(classname[classid]);
    prevClass=classid;
}

function sortdifcmp(a,b) {
    var x=false;
    if(1) {
        if(a.difficult=="?") x=(0<Number(b.difficult));
        if(b.difficult=="?") x=(Number(a.difficult)<0);
        x=(Number(a.difficult)<Number(b.difficult));
    }else if(0) {
        if(a.difficult=="?") x=(5000>Number(b.difficult));
        if(b.difficult=="?") x=(Number(a.difficult)>5000);
        x=(Number(a.difficult)>Number(b.difficult));
    }
    if(x) return 1;
    else return -1;
}

function sortdatcmp(a,b) {
    var x=false;
    if(a.date != b.date) x = a.date<b.date;
    else x = a.ord>b.ord;
    if(x) return 1;
    else return -1;
}

function sortqualcmp(a,b) {
    var x=false;
    if(a.quality=="?") x=(0<Number(b.quality));
    if(b.quality=="?") x=(Number(a.quality)<0);
    x=(Number(a.quality)<Number(b.quality));
    if(x) return 1;
    else return -1;
}

function sortProblems(id) {
    if(id==0) problemData.sort(sortdatcmp);
    if(id==1) problemData.sort(sortdifcmp);
    if(id==2) problemData.sort(sortqualcmp);
    rerender(problemData);
}


function rerender(problemData) {
    var htmlcode="<tr>";
    for(var i=0;i<problemData.length;i++){
        var problem=problemData[i];
        console.log(typeof problem.difficult)
        if(typeof problem.difficult == "number")problem.difficult=problem.difficult.toFixed(0);
        if(typeof problem.quality == "number")problem.quality=problem.quality.toFixed(2);
        

        htmlcode+="<tr class=\"problem problem"+problem.class.toString()+"\">";
        htmlcode+="<td><strong>"+problem.date+"</strong></td>";
        htmlcode+="<td id='' >";
        htmlcode+="<a  target='_blank'>"+problem.name+"</a>";
        htmlcode+=" <a class='' onclick='showInfo("+problem.id+")'> ";
        // htmlcode+="<i class='info circle icon'></i></a>";  
        htmlcode+="<a href='https://sy.hhwdd.com/new/ViewGProblem.page?gpid="+problem.id+"'>";
        htmlcode+="<i class='external alternate icon'></i></a>"
        htmlcode+="</td>";
        htmlcode+="<td class='CFrating' style='color: "+getColorCode2CF(problem.difficult)+";font-weight: 500;' data-position='left center' data-original-title='' title=''>";
        htmlcode+=get_circleCF(problem.difficult);
        htmlcode+=problem.difficult.toString();
        htmlcode+="</td>";
        htmlcode+="<td style='color: "+getQualityColor(problem.quality)+";font-weight: 500;' data-position='left center' data-original-title=' title='>";
        if(problem.quality<0.5) htmlcode+="💩 ";
        htmlcode+=problem.quality;
        htmlcode+="</td>";
        htmlcode+="<td style='text-align: center;'>"
        htmlcode+="<a type='button' class='' onclick='vote( "+i+")'>Vote</a>"
        htmlcode+="</td>";
        // htmlcode+="<td style='text-align: center;'>";
        // htmlcode+="<a type='button' class='' onclick='showVotes('"+problem.name+"')'>Show Votes</a>"
        // htmlcode+="</td>"
        htmlcode+="</tr>"
    }
    document.getElementsByClassName("problems")[0].innerHTML=htmlcode;
    init(prevClass);
}

$(function(){
    if(parseCookies(document.cookie).username)document.getElementsByClassName("right menu")[0].getElementsByTagName("a")[0].innerHTML="Logout";;
    console.log("114514");
    fetch("/api",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ method: 'get' })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        problemData=data;
        sortProblems(0);
        rerender(problemData);
        init(prevClass);
        // $(".ATrating").hide(); 
    }).catch(error => console.error('Error:', error));
    $('.ui.dropdown').dropdown({ action: "select" });
});

function login() {
    if(parseCookies(document.cookie).username){
        document.cookie="username=;password=;"
        alert("我也不知道登出成没成功，你看着办吧。")
        return;
    }
    var modal = document.createElement("div");
    // let data = res;
    // console.log(data);
    var modalHTML = /*html*/`
    <div class="ui modal" id="loginModal" style="width:600px" >
        <i class="inside close icon"></i>
        <div class="header">
            <span id="voteModalTitle">登录清澄评分系统</a></span>
        </div>
        <div class="content">
            <form class="ui form" id="loginForm">
                <div class="field">
                    <label>若不知道账号请找 xhabc66 申请</label>
                </div> 
                <div class="field">
                    <label>用户名:</label>
                    <input type="text" placeholder="请填写用户名" value="" id="username">
                </div>        
                    <div class="field">
                    <label>密码：</label>
                    <input type="password" placeholder="" value="" id="password">
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui toggle checkbox">
                <input type="checkbox" id="public">
                <label for="public">公开评分</label>
            </div>
            <button id="loginSubmit" class="ui primary button">登录</button>
        </div>
    </div>
            
    `;
    modal.style.width="600px";
    document.body.innerHTML+=modalHTML;//.appendChild(modal);
        // console.log(modal);
    $('#loginModal').modal('show');
        // destroy on hide
    $('#loginModal').modal({
        onHidden: function () {
            $('#loginModal').remove();
        }
    })
    $('#loginForm').form({
        fields: {
            username: {
                identifier: 'username',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入用户名'
                    },
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: '请输入密码'
                    }
                ]
            },
        },
        inline: true,
        on: 'blur'
    });
    $('#qual').rating({ 'showClear': false, 'showCaption': false, 'size': 'sm' });
    $('#loginSubmit').click(function (event) {
        var password = $('#password').val();
        var username = $('#username').val();
        if($('public').checked){alert("你还想把密码公开？？？");return;}

        fetch("/api",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', 
            body:JSON.stringify({
                method:"login",
                password:password,
                username:username
            })
        }).then(response => response.text())
        .then(data => {
            alert(data);
            if(data=="登录成功")location.href=location.href;
            var cookie=parseCookies(document.cookie);
            if(!cookie.username)document.getElementsByClassName("right menu")[0].getElementsByTagName("a")[0].innerHTML="Login";
            else document.getElementsByClassName("right menu")[0].getElementsByTagName("a")[0].innerHTML="Logout";
            
        }).catch(error => console.error('Error:', error));

    });
}




