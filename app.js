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

// 退出登录（清空所有身份信息）
function userLogout(){
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userDID");
    location.href="index.html";
}

// 页面权限拦截 + 自动回填DID
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
    // 自动填充所有页面的DID输入框
    autoFillUserDID();
})

// 填充用户信息
function fillUserInfo(){
    let user = JSON.parse(localStorage.getItem("userInfo")||"{}");
    let unameDom = document.getElementById("userName");
    if(unameDom) unameDom.innerText = user.username||"管理员";
}

// ========== DID 核心功能（用户无需手动查找）==========
// 保存DID到本地
function saveUserDID(didStr){
    localStorage.setItem("userDID", didStr);
}

// 获取本地DID
function getUserDID(){
    return localStorage.getItem("userDID") || "";
}

// 自动填充页面所有DID输入框
function autoFillUserDID(){
    let did = getUserDID();
    if(!did) return;
    document.querySelectorAll('input[placeholder*="DID"], input[id*="did"]').forEach(item => {
        item.value = did;
    });
}

// 一键复制功能
function copyText(text){
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert('复制成功！');
}
