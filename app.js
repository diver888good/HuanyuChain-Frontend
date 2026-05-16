const API_BASE = "https://huanyuchain.pythonanywhere.com";

// 只保留登录测试
async function testLogin() {
  try {
    let res = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123456" })
    });
    let data = await res.json();
    alert("成功：" + JSON.stringify(data));
  } catch (e) {
    alert("真实错误：" + e.message);
    console.log(e);
  }
}

// 页面加载自动测试
window.onload = testLogin;
