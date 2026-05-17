const API_BASE = "https://huanyuchain.pythonanywhere.com";

// GET请求
async function httpGet(url) {
    try {
        let res = await fetch(`${API_BASE}${url}`, {
            headers: {
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem("token")||""
            }
        })
        return await res.json();
    }catch(e){
        return {code:500,msg:"服务请求失败"}
    }
}

// POST请求
async function httpPost(url,data={}) {
    try {
        let res = await fetch(`${API_BASE}${url}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem("token")||""
            },
            body:JSON.stringify(data)
        })
        return await res.json();
    }catch(e){
        return {code:500,msg:"服务请求失败"}
    }
}

// 登录状态校验
async function verifyLogin(){
    let token = localStorage.getItem("token");
    if(!token) return false;
    let res = await httpGet("/api/auth/check");
    return res.code === 200;
}

// 退出登录
function userLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    location.href="index.html";
}

// 页面权限拦截
document.addEventListener("DOMContentLoaded",async ()=>{
    let loginStatus = await verifyLogin();
    let currPage = location.pathname.split("/").pop();
    let needLoginPages = [
        "dashboard.html","realname.html","cert.html","did.html",
        "video.html","gov.html","meta.html","privacy.html",
        "judicial.html","audit.html","cross.html","contract.html",
        "iot.html","market.html","ai.html"
    ];
    if(needLoginPages.includes(currPage) && !loginStatus){
        location.href="index.html";
    }
    if(currPage === "index.html" && loginStatus){
        location.href="dashboard.html";
    }
})

// 填充用户信息
function fillUserInfo(){
    let user = JSON.parse(localStorage.getItem("userInfo")||"{}");
    let unameDom = document.getElementById("userName");
    if(unameDom) unameDom.innerText = user.username||"管理员";
}
