const API_BASE = "https://huanyuchain.pythonanywhere.com";

async function httpGet(url) {
    try {
        let res = await fetch(API_BASE + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") || ""
            }
        });
        return await res.json();
    } catch (e) {
        return { code: 500, msg: "请求异常" };
    }
}

async function httpPost(url, data) {
    try {
        let res = await fetch(API_BASE + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") || ""
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (e) {
        return { code: 500, msg: "请求异常" };
    }
}

async function verifyToken() {
    let token = localStorage.getItem("token");
    if (!token) return false;
    let res = await httpGet("/api/auth/check");
    return res.code === 200;
}

// 🔥 全局修复，所有页面自动生效
function showUserInfo() {
    try {
        let userStr = localStorage.getItem("userInfo");
        if (!userStr) return;
        let info = JSON.parse(userStr);
        let userElem = document.getElementById("username");
        let boxElem = document.getElementById("userInfo");
        if (userElem) userElem.innerText = info.username || "";
        if (boxElem) boxElem.style.display = "block";
    } catch (e) {}
}

// 自动执行
document.addEventListener("DOMContentLoaded", async () => {
    if (await verifyToken()) {
        showUserInfo();
    }
});
