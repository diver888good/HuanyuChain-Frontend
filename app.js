// 寰域链 V8.0 全局核心工具文件
// 所有页面统一依赖此文件，请勿修改函数名和参数
// 最终版：2026-05-16

// 后端API基础地址（部署时自动生效）
const API_BASE = "https://huanyuchain.pythonanywhere.com";

/**
 * 获取登录Token
 * @returns {string} Token
 */
function getToken() { 
    return localStorage.getItem("token") || ""; 
}

/**
 * 获取用户信息
 * @returns {object} 用户信息对象
 */
function getUserInfo() {
    return JSON.parse(localStorage.getItem("userInfo") || "{}");
}

/**
 * 获取用户名
 * @returns {string} 用户名
 */
function getUsername() { 
    const userInfo = getUserInfo();
    return userInfo.username || ""; 
}

// 页面初始化
document.addEventListener("DOMContentLoaded", function () {
    initUserInfo();
    bindLogoutEvent();
});

/**
 * 初始化顶部用户信息显示
 */
function initUserInfo() {
    const userInfoDom = document.getElementById("userInfo");
    const usernameDom = document.getElementById("username");
    const token = getToken();
    const username = getUsername();
    
    if (userInfoDom && usernameDom) {
        userInfoDom.style.display = token ? "flex" : "none";
        usernameDom.innerText = username; // 与全局样式保持一致
    }
}

/**
 * 绑定退出登录事件
 */
function bindLogoutEvent() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.onclick = () => {
            localStorage.clear();
            alert("✅ 已退出登录");
            location.href = "index.html"; // 统一跳转到首页登录
        };
    }
}

/**
 * 登录状态校验（所有页面统一使用）
 * @returns {boolean} 是否登录
 */
async function verifyToken() {
    const token = getToken();
    if (!token) {
        alert("❌ 请先登录！");
        location.href = "index.html"; // 统一跳转到首页登录
        return false;
    }
    return true;
}

/**
 * 统一POST请求封装（所有接口统一使用）
 * @param {string} url 接口相对路径
 * @param {object} data 请求数据
 * @returns {Promise} 响应结果
 */
async function httpPost(url, data = {}) {
    try {
        const response = await fetch(API_BASE + url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken() // 自动携带Token
            },
            body: JSON.stringify(data)
        });

        // 处理Token过期
        if (response.status === 401) {
            localStorage.clear();
            alert("❌ 登录已过期，请重新登录");
            location.href = "index.html";
            return { code: 401, msg: "登录已过期" };
        }

        return await response.json();
    } catch (error) {
        console.error("接口请求失败：", error);
        alert("❌ 网络异常，请检查网络后重试");
        return { code: 500, msg: "网络异常" };
    }
}

/**
 * 统一GET请求封装（预留扩展）
 * @param {string} url 接口相对路径
 * @returns {Promise} 响应结果
 */
async function httpGet(url) {
    try {
        const response = await fetch(API_BASE + url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization": getToken() // 自动携带Token
            }
        });

        // 处理Token过期
        if (response.status === 401) {
            localStorage.clear();
            alert("❌ 登录已过期，请重新登录");
            location.href = "index.html";
            return { code: 401, msg: "登录已过期" };
        }

        return await response.json();
    } catch (error) {
        console.error("接口请求失败：", error);
        alert("❌ 网络异常，请检查网络后重试");
        return { code: 500, msg: "网络异常" };
    }
}
