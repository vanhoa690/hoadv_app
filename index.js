const userId = localStorage.getItem("userId");
if (!userId) {
  location.replace("/login.html");
}
const lixiValues = ["lixi_0", "lixi_10", "lixi_20", "lixi_50"];
// Danh sách lì xì và tỷ lệ xuất hiện tương ứng (phần trăm)
const lixiList = [
  { value: "Bạn nhận được 10,000 VNĐ! 🎁", percentage: 30 }, // 40%
  { value: "Chúc mừng! Bạn nhận được 20,000 VNĐ! 🎉", percentage: 10 }, // 30%
  { value: "Wow! Bạn nhận được 50,000 VNĐ! 🧧", percentage: 8 }, // 20%
  { value: "Bạn nhận được 100,000 VNĐ! 🤑", percentage: 2 }, // 5%
  {
    value: "Chúc mừng năm mới! Bạn nhận được 1,000,000 VNĐ! 🥳",
    percentage: 0,
  }, // 4%
  { value: "Chúc mừng năm mới, thử lại lần sau nhé! 😅", percentage: 50 }, // 1%
];

// Tạo mảng tỷ lệ dựa trên danh sách lixiList
function createWeightedArray(list) {
  const weightedArray = [];
  list.forEach((item) => {
    for (let i = 0; i < item.percentage; i++) {
      weightedArray.push(item.value);
    }
  });
  return weightedArray;
}

// Mảng tỷ lệ đã được tạo
const weightedLixiArray = createWeightedArray(lixiList);

// Hàm random theo tỷ lệ
function getRandomLixi() {
  const randomIndex = Math.floor(Math.random() * weightedLixiArray.length);
  return weightedLixiArray[randomIndex];
}

// Phần tử DOM
const lixiImage = document.getElementById("lixiImage");
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
  const message = getRandomLixi();
  // const randomIndex = Math.floor(Math.random() * lixiList.length);
  // const randomLixi = Math.floor(Math.random() * lixiValues.length);
  // const message = lixiList[randomIndex];

  // Hiển thị thông báo
  notification.textContent = `🎉 ${message}`;
  notification.classList.add("show");
  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show");
  }, 1000);
  // saveLixi(lixiValues[randomLixi]);
  // Thêm hiệu ứng rung
  lixiImage.classList.add("shake");
  setTimeout(() => lixiImage.classList.remove("shake"), 1000);
}

// Hàm reset lì xì
function resetLixi() {
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

function renderProductRow(product, index) {
  return `
     <tr>
        <th scope="row">${`Lần Lắc ${index + 1}`}</th>
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
              <th scope="col">Lắc</th>
              <th scope="col">User Id</th>
              <th scope="col">Li xi</th>
            </tr>
          </thead>
          <tbody>
          ${products
            .map((product, index) => renderProductRow(product, index))
            .join("")}
          </tbody>
        </table>
         `;
}

showProductList();
