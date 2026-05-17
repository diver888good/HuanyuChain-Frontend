const API_BASE = "https://huanyuchain.pythonanywhere.com";

function getToken() {
    return localStorage.getItem("token") || "";
}

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

async function verifyToken() {
    if (!getToken()) return false;
    try {
        let res = await httpGet("/api/auth/check");
        return res.code === 200;
    } catch (e) {
        return false;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    location.href = "index.html";
}
