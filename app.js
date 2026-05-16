// ===================== 核心配置 =====================
// 云端正式服务，100%可用
const API_BASE = "https://huanyuchain.pythonanywhere.com";

// ===================== 工具函数 =====================
function getToken() { 
    return localStorage.getItem("token") || ""; 
}
function getUsername() { 
    return localStorage.getItem("username") || ""; 
}

// ===================== 页面初始化 =====================
document.addEventListener("DOMContentLoaded", function () {
    initUserInfo();
    bindLogoutEvent();
});

// ===================== 渲染用户信息 =====================
function initUserInfo() {
    const userInfoDom = document.getElementById("userInfo");
    const usernameDom = document.getElementById("username");
    const token = getToken();
    const username = getUsername();

    if (userInfoDom && usernameDom) {
        if (token && username) {
            userInfoDom.style.display = "flex";
            usernameDom.innerText = `用户：${username}`;
        } else {
            userInfoDom.style.display = "none";
        }
    }
}

// ===================== 退出登录 =====================
function bindLogoutEvent() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.clear();
            alert("已退出登录");
            location.href = "index.html";
        });
    }
}

// ===================== 登录校验 =====================
async function verifyToken() {
    const token = getToken();
    if (!token) {
        alert("请先登录！");
        location.href = "login.html";
        return false;
    }
    return true;
}

// ===================== 网络请求（修复跨域+空Token） =====================
async function httpPost(url, data = {}) {
    try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) headers["Authorization"] = "Bearer " + token;

        const response = await fetch(API_BASE + url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            mode: "cors"
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        alert("网络异常，请检查网页是否用 http:// 打开");
        return { code: 500, msg: "请求失败" };
    }
}

async function httpGet(url) {
    try {
        const headers = {};
        const token = getToken();
        if (token) headers["Authorization"] = "Bearer " + token;

        const response = await fetch(API_BASE + url, {
            method: "GET",
            headers: headers,
            mode: "cors"
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        alert("网络异常，请检查网页是否用 http:// 打开");
        return { code: 500, msg: "请求失败" };
    }
}
