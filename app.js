// ===================== 核心配置 =====================
const API_BASE = "https://huanyuchain.pythonanywhere.com";

// ===================== 工具函数 =====================
function getToken() { 
    return localStorage.getItem("token") || ""; 
}
function getUsername() { 
    return localStorage.getItem("username") || ""; 
}
function getUserId() {
    return localStorage.getItem("user_id") || "";
}

// ===================== 页面初始化 =====================
document.addEventListener("DOMContentLoaded", function () {
    // 移动端菜单适配
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }
    // 初始化用户状态
    initUserInfo();
    bindLogoutEvent();
});

// ===================== 渲染用户登录状态 =====================
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
            // 清空本地缓存
            localStorage.clear();
            alert("已退出登录");
            // 跳转到首页
            location.href = "index.html";
        });
    }
}

// ===================== 登录校验（页面权限控制） =====================
async function verifyToken() {
    const token = getToken();
    if (!token) {
        alert("请先登录！");
        location.href = "login.html";
        return false;
    }
    return true;
}

// ===================== 网络请求封装 =====================
/**
 * POST请求
 * @param {string} url 接口地址
 * @param {object} data 请求参数
 */
async function httpPost(url, data = {}) {
    try {
        const headers = {
            "Content-Type": "application/json"
        };
        // 自动携带Token
        const token = getToken();
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const response = await fetch(API_BASE + url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            mode: "cors"
        });

        return await response.json();
    } catch (error) {
        console.error("请求异常：", error);
        alert("网络异常，请检查服务是否启动");
        return { code: 500, msg: "网络请求失败" };
    }
}

/**
 * GET请求
 * @param {string} url 接口地址
 */
async function httpGet(url) {
    try {
        const headers = {};
        // 自动携带Token
        const token = getToken();
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const response = await fetch(API_BASE + url, {
            method: "GET",
            headers: headers,
            mode: "cors"
        });

        return await response.json();
    } catch (error) {
        console.error("请求异常：", error);
        alert("网络异常，请检查服务是否启动");
        return { code: 500, msg: "网络请求失败" };
    }
}
