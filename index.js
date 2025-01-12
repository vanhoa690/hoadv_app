const token = sessionStorage.getItem("token");
const API_URL = "https://api.webopsagency.com";

if (!token) {
  location.replace("/login.html");
} else {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Phần tử DOM
  const showMaxPlay = document.getElementById("maxPlay");
  const lixiImage = document.getElementById("lixiImage");
  const notification = document.getElementById("notification");

  async function getLixi() {
    try {
      const {
        data: { data: awardList },
      } = await axios.get(`${API_URL}/awards-list`);
      const totalMoney = awardList.reduce((sum, item) => {
        return sum + item.luckyMoneyId?.value || 0;
      }, 0);
      showMaxPlay.textContent = `Bạn đã nhận được ${totalMoney} VNĐ`;
    } catch (error) {
      console.log(error);
    }
  }
  getLixi();
  // Hàm hiển thị lì xì ngẫu nhiên
  async function showLixi() {
    try {
      const { data } = await axios.post(`${API_URL}/genawards`);
      const message = data?.message || "Chúc mừng năm mới";
      // Hiển thị thông báo
      notification.textContent = `🎉 ${message}`;
      notification.classList.add("show");
      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        notification.classList.remove("show");
      }, 2000);
      getLixi();
      // Thêm hiệu ứng rung
      lixiImage.classList.add("shake");
      setTimeout(() => lixiImage.classList.remove("shake"), 1000);
    } catch (error) {
      alert("Bạn đã hết lượt chơi");
      console.log(error);
    }
  }

  // Thêm sự kiện click vào bao lì xì
  lixiImage.addEventListener("click", showLixi);

  // Khởi tạo Shake.js
  const shakeEvent = new Shake({
    threshold: 15, // Độ nhạy của lắc
    timeout: 1000, // Thời gian giữa các lần lắc
  });

  // Lắng nghe sự kiện lắc
  shakeEvent.start();

  window.addEventListener(
    "shake",
    function () {
      showLixi();
    },
    false
  );

  // Đảm bảo dừng lắng nghe khi không cần thiết
  window.addEventListener("beforeunload", function () {
    shakeEvent.stop();
  });
}
// Hàm reset lì xì
async function resetLixi() {
  try {
    await axios.get(`${API_URL}/awards-delete`);
  } catch (error) {
    console.log(error);
  }
}
