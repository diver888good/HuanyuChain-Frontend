// ===================== 【唯一正确】后端接口地址 =====================
const BASE_API = "https://huanyuchain.pythonanywhere.com";

// ===================== 自动填充本地登录用户信息 =====================
function fillUserInfo() {
    if (!localStorage.userInfo) return;
    try {
        let user = JSON.parse(localStorage.userInfo);
        let nameDom = document.getElementById("userName");
        if (nameDom) {
            nameDom.innerText = user.username || "普通用户";
        }
    } catch (e) {
        console.error("用户信息解析失败", e);
    }
}

// ===================== 智能退出登录（适配管理员/普通用户页面） =====================
function userLogout() {
    // 清空登录缓存
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    alert("已安全退出登录");

    // 自动判断：管理员页面 → 跳管理员登录；普通页面 → 跳用户登录
    const isAdminPage = window.location.href.includes("admin_");
    if (isAdminPage) {
        location.href = "admin_login.html";
    } else {
        location.href = "login.html";
    }
}

// ===================== 封装 GET 请求（自动携带Token） =====================
async function httpGet(url) {
    const fullUrl = BASE_API + url;
    const headers = {
        "Content-Type": "application/json"
    };

    // 自动添加登录令牌
    if (localStorage.userInfo) {
        try {
            const user = JSON.parse(localStorage.userInfo);
            headers["Authorization"] = `Bearer ${user.token}`;
        } catch (e) {}
    }

    try {
        const res = await fetch(fullUrl, {
            method: "GET",
            headers: headers
        });
        return await res.json();
    } catch (err) {
        alert("服务器连接失败，请检查后端服务是否正常运行");
        console.error("GET请求异常：", err);
        return { code: 500, msg: "网络请求异常" };
    }
}

// ===================== 封装 POST 请求（自动携带Token） =====================
async function httpPost(url, data = {}) {
    const fullUrl = BASE_API + url;
    const headers = {
        "Content-Type": "application/json"
    };

    // 自动添加登录令牌
    if (localStorage.userInfo) {
        try {
            const user = JSON.parse(localStorage.userInfo);
            headers["Authorization"] = `Bearer ${user.token}`;
        } catch (e) {}
    }

    try {
        const res = await fetch(fullUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        alert("服务器连接失败，请检查后端服务是否正常运行");
        console.error("POST请求异常：", err);
        return { code: 500, msg: "网络请求异常" };
    }
}

// ===================== 页面初始化：自动加载用户信息 =====================
window.onload = function () {
    fillUserInfo();
};
