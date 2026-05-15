// ===================== 核心配置 =====================
const API_BASE = "https://huanyuchain.pythonanywhere.com";
// 实时获取本地存储（解决页面切换失效问题）
function getToken() { return localStorage.getItem("token"); }
function getUsername() { return localStorage.getItem("username"); }

// ===================== 页面初始化 =====================
document.addEventListener("DOMContentLoaded", function () {
    // 移动端菜单切换
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    if (toggle) {
        toggle.addEventListener("click", () => nav.classList.toggle("active"));
    }
    // 初始化用户信息
    initUserInfo();
    // 绑定退出事件
    bindLogoutEvent();
});

// ===================== 用户信息 =====================
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
        location.href = "index.html";
        return false;
    }
    return true;
}

// ===================== 网络请求（修复版，全接口兼容） =====================
/**
 * POST请求
 * @param {string} url 接口路径 /api/xxx
 * @param {object} data 请求参数
 */
async function httpPost(url, data) {
    try {
        const headers = { "Content-Type": "application/json" };
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data || {})
        });
        // 处理非JSON响应
        try {
            return await res.json();
        } catch {
            return { code: 500, msg: "服务器响应异常" };
        }
    } catch (e) {
        alert("网络异常，请检查后端服务");
        console.error(e);
        return { code: 500, msg: "网络错误" };
    }
}

/**
 * GET请求
 * @param {string} url 接口路径 /api/xxx
 */
async function httpGet(url) {
    try {
        const headers = {};
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE}${url}`, {
            headers: headers
        });
        // 处理非JSON响应
        try {
            return await res.json();
        } catch {
            return { code: 500, msg: "服务器响应异常" };
        }
    } catch (e) {
        alert("网络异常，请检查后端服务");
        console.error(e);
        return { code: 500, msg: "网络错误" };
    }
}
