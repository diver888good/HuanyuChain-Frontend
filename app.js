// 完全正确的配置
const API_BASE = "https://huanyuchain.pythonanywhere.com";

function getToken() { 
    return localStorage.getItem("token") || ""; 
}
function getUsername() { 
    return localStorage.getItem("username") || ""; 
}

document.addEventListener("DOMContentLoaded", function () {
    initUserInfo();
    bindLogoutEvent();
});

function initUserInfo() {
    const userInfoDom = document.getElementById("userInfo");
    const usernameDom = document.getElementById("username");
    const token = getToken();
    const username = getUsername();
    if (userInfoDom && usernameDom) {
        userInfoDom.style.display = token ? "flex" : "none";
        usernameDom.innerText = `用户：${username}`;
    }
}

function bindLogoutEvent() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.onclick = () => {
            localStorage.clear();
            alert("已退出登录");
            location.href = "index.html";
        };
    }
}

async function verifyToken() {
    if (!getToken()) {
        alert("请先登录！");
        location.href = "login.html";
        return false;
    }
    return true;
}

// ✅ 标准请求
async function httpPost(url, data = {}) {
    try {
        const response = await fetch(API_BASE + url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        alert("网络异常，请重试");
        return { code: 500 };
    }
}
