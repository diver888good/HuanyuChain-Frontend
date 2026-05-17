// 后端接口根地址
const API_BASE = "https://huanyuchain.pythonanywhere.com";

// 获取本地存储Token
function getToken() {
    return localStorage.getItem("token") || "";
}

// GET请求封装
async function httpGet(url) {
    const res = await fetch(`${API_BASE}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken()
        }
    });
    return await res.json();
}

// POST请求封装
async function httpPost(url, data) {
    const res = await fetch(`${API_BASE}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken()
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

// 登录状态校验接口
async function verifyToken() {
    if (!getToken()) return false;
    try {
        const res = await httpGet("/api/auth/check");
        return res.code === 200;
    } catch (e) {
        console.log("接口请求失败：", e);
        return false;
    }
}

// 退出登录全局方法
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    location.href = "index.html";
}
