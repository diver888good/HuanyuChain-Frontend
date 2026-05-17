// ===================== 全局后端接口地址（不变） =====================
const BASE_API = "https://huanyuchain.pythonanywhere.com";

// ===================== 获取本地登录用户信息（不变） =====================
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

// ===================== 【核心修改】智能退出登录：自动区分前后台 =====================
function userLogout() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    alert("已退出登录");
    
    // 自动判断：后台页面 → 跳后台登录页；前台页面 → 跳前台登录页
    let currentPage = window.location.href;
    // 包含这些关键词的是【后台页面】，退出跳 admin_login.html
    if (currentPage.includes("dashboard.html") || 
        currentPage.includes("realname.html") || 
        currentPage.includes("cert.html") || 
        currentPage.includes("audit.html") || 
        currentPage.includes("cross.html") || 
        currentPage.includes("judicial.html")) {
        location.href = "admin_login.html";
    } else {
        // 【前台页面】，退出跳 login.html
        location.href = "login.html";
    }
}

// ===================== 封装GET请求（不变） =====================
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

// ===================== 封装POST请求（不变） =====================
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

// ===================== 页面初始化（不变） =====================
window.onload = function(){
    fillUserInfo();
}
