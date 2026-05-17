const API_BASE = "https://huanyuchain.pythonanywhere.com";

async function httpGet(url) {
    try {
        let res = await fetch(API_BASE + url, {
            headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") || "" }
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
            headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") || "" },
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

function showUserInfo() {
    try {
        let user = JSON.parse(localStorage.getItem("userInfo"));
        if (user && document.getElementById("username")) {
            document.getElementById("username").innerText = user.username;
            document.getElementById("userInfo").style.display = "flex";
        }
    } catch (e) {}
}

document.addEventListener("DOMContentLoaded", async () => {
    if (await verifyToken()) showUserInfo();
});
