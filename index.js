const userId = localStorage.getItem("userId");
if (!userId) {
  location.replace("/login.html");
}
const lixiList = [
  "Bạn nhận được 50,000 VNĐ! 🎁",
  "Chúc mừng! Bạn nhận được 100,000 VNĐ! 🎉",
  "Wow! Bạn nhận được 200,000 VNĐ! 🧧",
  "Bạn nhận được 500,000 VNĐ! 🤑",
  "Chúc mừng năm mới! Bạn nhận được 1,000,000 VNĐ! 🥳",
  "Hôm nay bạn hơi đen, thử lại lần sau nhé! 😅",
];

// Phần tử DOM
const lixiImage = document.getElementById("lixiImage");
const lixiResult = document.getElementById("lixiResult");
const notification = document.getElementById("notification");

async function saveLixi(lixi) {
  const data = {
    userId,
    lixi,
  };
  try {
    await axios.post("http://localhost:3000/products", data);
    // alert("lixi thanh cong");
  } catch (error) {
    alert("error");
  }
}

// Hàm hiển thị lì xì ngẫu nhiên
function showLixi() {
  const randomIndex = Math.floor(Math.random() * lixiList.length);
  const message = lixiList[randomIndex];

  lixiResult.textContent = message;
  // Hiển thị thông báo
  notification.textContent = message;
  notification.classList.add("show");
  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);

  // Thêm hiệu ứng rung
  lixiImage.classList.add("shake");
  setTimeout(() => lixiImage.classList.remove("shake"), 1000);
  //   saveLixi(lixiList[randomIndex]);
}

// Hàm reset lì xì
function resetLixi() {
  lixiResult.textContent = "🎉";
  notification.textContent = "";
  notification.classList.remove("show");
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

function renderProductRow(product) {
  return `
     <tr>
        <th scope="row">${product.id}</th>
                <td>${product.userId}</td>
                <td>${product.lixi} VND</td>
        </tr>
    `;
}

async function showProductList() {
  const res = await axios.get(
    `http://localhost:3000/products?userId=${userId}`
  );
  const products = res.data;
  document.getElementById("list").innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">User Id</th>
              <th scope="col">Li xi</th>
            </tr>
          </thead>
          <tbody>
          ${products.map(renderProductRow).join("")}
          </tbody>
        </table>
         `;
}

showProductList();
