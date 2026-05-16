// 唯一配置
const API_BASE = "https://huanyuchain.pythonanywhere.com";

// 页面加载直接测试后端
window.onload = async function() {
  try {
    // 只请求后端根地址，最简单的请求
    const res = await fetch(API_BASE);
    const data = await res.json();
    alert("✅ 后端连接成功：" + JSON.stringify(data));
  } catch (err) {
    // 打印真实错误！
    console.error("真实错误：", err);
    alert("❌ 连接失败，错误：" + err.message);
  }
};
