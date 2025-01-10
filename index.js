const lixiList = [
  { value: 10, text: "Bạn nhận được 10,000 VNĐ! 🎁", percentage: 30 }, //30% - xuat hien 30 lan
  {
    value: 20,
    text: "Chúc mừng! Bạn nhận được 20,000 VNĐ! 🎉",
    percentage: 10,
  },
  { value: 50, text: "Wow! Bạn nhận được 50,000 VNĐ! 🧧", percentage: 8 },
  { value: 100, text: "Bạn nhận được 100,000 VNĐ! 🤑", percentage: 2 },
  {
    value: 200,
    text: "Chúc mừng năm mới! Bạn nhận được 200,000 VNĐ! 🥳",
    percentage: 0,
  },
  {
    value: 0,
    text: "Chúc mừng năm mới, thử lại lần sau nhé! 😅",
    percentage: 50,
  },
];

// Hàm xáo trộn mảng sử dụng thuật toán Fisher-Yates Shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Chọn một chỉ số ngẫu nhiên từ 0 đến i
    [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí phần tử
  }
}

// Tạo mảng tỷ lệ dựa trên danh sách lixiList
function createWeightedArray(list) {
  const weightedArray = [];
  list.forEach((item) => {
    for (let i = 0; i < item.percentage; i++) {
      weightedArray.push(item.value);
    }
  });
  shuffleArray(weightedArray); // Xáo trộn mảng sau khi tạo
  return weightedArray;
}

// Mảng tỷ lệ đã được tạo
const weightedLixiArray = createWeightedArray(lixiList);
console.log(weightedLixiArray);

function getRandomLixi() {
  const randomIndex = Math.floor(Math.random() * weightedLixiArray.length);
  return {
    value: weightedLixiArray[randomIndex],
    message:
      lixiList.find((lixi) => lixi.value === weightedLixiArray[randomIndex])
        ?.text || "Chúc mừng năm mới, thử lại lần sau nhé! 😅",
  };
}

// Phần tử DOM
const lixiImage = document.getElementById("lixiImage");
const notification = document.getElementById("notification");

// Hàm hiển thị lì xì ngẫu nhiên
function showLixi() {
  const lixi = getRandomLixi();
  console.log(lixi);

  // Hiển thị thông báo
  notification.textContent = `🎉 ${lixi.message}`;
  notification.classList.add("show");
  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);

  // Thêm hiệu ứng rung
  lixiImage.classList.add("shake");
  setTimeout(() => lixiImage.classList.remove("shake"), 1000);
}

// Hàm reset lì xì
function resetLixi() {
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
