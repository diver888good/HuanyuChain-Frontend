// ===================== 核心配置 =====================
const API_BASE = "https://huanyuchain.pythonanywhere.com";

// ===================== 工具函数 =====================
function getToken() { 
    return localStorage.getItem("token") || ""; 
}
function getUsername() { 
    return localStorage.getItem("username") || ""; 
}

// ===================== 页面初始化（全局自动执行） =====================
document.addEventListener("DOMContentLoaded", function () {
    // 移动端菜单适配
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => nav.classList.toggle("active"));
    }
    // 渲染用户登录状态
    initUserInfo();
    // 绑定退出登录事件
    bindLogoutEvent();
});

// ===================== 渲染登录用户信息 =====================
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

// ===================== 登录校验（所有页面通用） =====================
async function verifyToken() {
    const token = getToken();
    if (!token) {
        alert("请先登录！");
        location.href = "login.html";
        return false;
    }
    return true;
}

// ===================== 统一网络请求（修复版·无冲突） =====================
/**
 * 通用POST请求（全接口兼容）
 * @param {string} url - 接口路径 例：/api/auth/full-real-auth
 * @param {object} data - 请求参数
 */
async function httpPost(url, data = {}) {
    try {
        const res = await fetch(API_BASE + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },
            body: JSON.stringify(data)
        });
        // 兼容非JSON响应，防止报错
        try {
            return await res.json();
        } catch {
            return { code: 500, msg: "服务器响应异常" };
        }
    } catch (err) {
        console.error("请求异常：", err);
        alert("网络异常，请检查服务");
        return { code: 500, msg: "网络请求失败" };
    }
}

/**
 * 通用GET请求
 * @param {string} url - 接口路径
 */
async function httpGet(url) {
    try {
        const res = await fetch(API_BASE + url, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });
        try {
            return await res.json();
        } catch {
            return { code: 500, msg: "服务器响应异常" };
        }
    } catch (err) {
        console.error("请求异常：", err);
        alert("网络异常，请检查服务");
        return { code: 500, msg: "网络请求失败" };
    }
}
