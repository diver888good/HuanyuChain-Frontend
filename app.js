// 修复：后端接口统一加 /api 前缀（核心修复！）
const API_BASE = "https://huanyuchain.pythonanywhere.com/api";
let token = localStorage.getItem("token");
let username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    if (toggle) toggle.addEventListener("click", () => nav.classList.toggle("active"));
    initUserInfo();
    bindLogoutEvent();
});

function initUserInfo() {
    const userInfoDom = document.getElementById("userInfo");
    const usernameDom = document.getElementById("username");
    if (token && username) {
        userInfoDom.style.display = "flex";
        usernameDom.innerText = `用户：${username}`;
    } else userInfoDom.style.display = "none";
}

function bindLogoutEvent() {
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.addEventListener("click", () => {
        localStorage.clear();
        location.href = "index.html";
    });
}

async function verifyToken() {
    if (!token) {
        alert("请先登录！");
        location.href = "index.html";
        return false;
    }
    return true;
}

// 网络请求（自动匹配后端接口）
async function httpPost(url, data) {
    try {
        const headers = {"Content-Type":"application/json"};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}${url}`, {
            method:"POST",
            headers:headers,
            body:JSON.stringify(data)
        });
        return await res.json();
    } catch (e) {
        alert("网络异常");
        return {code:500,msg:"网络错误"};
    }
}

async function httpGet(url) {
    try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}${url}`, {headers:headers});
        return await res.json();
    } catch (e) {
        alert("网络异常");
        return {code:500,msg:"网络错误"};
    }
}
