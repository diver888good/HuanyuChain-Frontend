// ===================== 【唯一正确】你的后端真实地址 =====================
const BASE_API = "https://huanyuchain.pythonanywhere.com";

// ===================== 获取本地登录用户信息 =====================
function fillUserInfo() {
    if (!localStorage.userInfo) return;
    try {
        let user = JSON.parse(localStorage.userInfo);
        let nameDom = document.getElementById("userName");
        if (nameDom) {
            nameDom.innerText = user.username || "普通用户";
        }
    } catch (e) {}
}

// ===================== 智能退出登录：自动区分前后台 =====================
function userLogout() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    alert("已退出登录");
    
    let currentPage = window.location.href;
    if (currentPage.includes("dashboard.html") || 
        currentPage.includes("realname.html") || 
        currentPage.includes("cert.html") || 
        currentPage.includes("audit.html")) {
        location.href = "admin_login.html";
    } else {
        location.href = "login.html";
    }
}

// ===================== 封装GET请求 =====================
async function httpGet(url) {
    let fullUrl = BASE_API + url;
    let headers = {
        "Content-Type": "application/json"
    };
    if (localStorage.userInfo) {
        let user = JSON.parse(localStorage.userInfo);
        headers["Authorization"] = `Bearer ${user.token}`;
    }
    try {
        let res = await fetch(fullUrl, {
            method: "GET",
            headers: headers
        });
        return await res.json();
    } catch (err) {
        alert("服务器连接失败，请检查后端服务是否启动");
        return {code:500, msg:"请求异常"};
    }
}

// ===================== 封装POST请求 =====================
async function httpPost(url, data = {}) {
    let fullUrl = BASE_API + url;
    let headers = {
        "Content-Type": "application/json"
    };
    if (localStorage.userInfo) {
        let user = JSON.parse(localStorage.userInfo);
        headers["Authorization"] = `Bearer ${user.token}`;
    }
    try {
        let res = await fetch(fullUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        alert("服务器连接失败，请检查后端服务是否启动");
        return {code:500, msg:"请求异常"};
    }
}

// ===================== 页面初始化自动填充用户信息 =====================
window.onload = function(){
    fillUserInfo();
}
