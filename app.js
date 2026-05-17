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
        return { code: 500, msg: "网络异常" };
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
        return { code: 500, msg: "网络异常" };
    }
}

async function verifyToken() {
    let token = localStorage.getItem("token");
    if (!token) return false;
    let res = await httpGet("/api/auth/check");
    return res.code === 200;
}

// 全局修复 showUserInfo
function showUserInfo() {
    try {
        let info = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (document.getElementById("username")) {
            document.getElementById("username").innerText = info.username || "";
            document.getElementById("userInfo").style.display = "block";
        }
    } catch (e) {}
}
