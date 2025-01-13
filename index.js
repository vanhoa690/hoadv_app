const lixiList = [
  { value: 10, text: "Bạn nhận được 10,000 VNĐ! 🎁", percentage: 30 }, //30% - xuat hien 30 lan
  {
    value: 20,
    text: "Chúc mừng! Bạn nhận được 20,000 VNĐ! 🎉",
    percentage: 5,
  },
  { value: 50, text: "Wow! Bạn nhận được 50,000 VNĐ! 🧧", percentage: 1 },
  { value: 100, text: "Bạn nhận được 100,000 VNĐ! 🤑", percentage: 0 },
  {
    value: 200,
    text: "Chúc mừng năm mới! Bạn nhận được 200,000 VNĐ! 🥳",
    percentage: 0,
  },
  {
    value: 0,
    text: "Chúc mừng năm mới, thử lại lần sau nhé! 😅",
    percentage: 64,
  },
];

let maxPlay = 0;

// Kiểm tra nếu thiết bị hỗ trợ DeviceMotionEvent
function initShakeEvent() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // iOS yêu cầu quyền truy cập
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          startShakeDetection();
        } else {
          alert(
            "Bạn cần cấp quyền truy cập chuyển động để sử dụng tính năng lắc lì xì."
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi yêu cầu quyền truy cập chuyển động:", error);
      });
  } else if (typeof DeviceMotionEvent !== "undefined") {
    // Trường hợp không phải iOS, bắt đầu lắng nghe ngay lập tức
    startShakeDetection();
  } else {
    alert("Thiết bị của bạn không hỗ trợ tính năng lắc.");
  }
}

// Khởi tạo thư viện shake.js
function startShakeDetection() {
  const shakeEvent = new Shake({
    threshold: 15, // Độ nhạy của lắc
    timeout: 1000, // Thời gian giữa các lần lắc
  });

  shakeEvent.start();

  window.addEventListener(
    "shake",
    function () {
      showLixi(); // Hàm hiển thị lì xì
    },
    false
  );

  // Đảm bảo dừng lắng nghe khi không cần thiết
  window.addEventListener("beforeunload", function () {
    shakeEvent.stop();
  });
}

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
const showMaxPlay = document.getElementById("maxPlay");
const showMoney = document.getElementById("money");
const lixiImage = document.getElementById("lixiImage");
const notification = document.getElementById("notification");

showMaxPlay.textContent = `Bạn còn ${maxPlay} lượt chơi`;

// Hàm hiển thị lì xì ngẫu nhiên
function showLixi() {
  const money = localStorage.getItem("lixi") || 0;
  if (maxPlay <= 0) {
    showMaxPlay.textContent = `Bạn nhận được ${money}k VND`;
    alert("Bạn đã hết lượt chơi");
    return;
  } else {
    maxPlay = maxPlay - 1;
    showMaxPlay.textContent = `Bạn còn ${maxPlay} lượt chơi và nhận được ${money}k VND`;
  }
  const lixi = getRandomLixi();

  const totalLixi = Number(money) + lixi.value;
  showMaxPlay.textContent = `Bạn còn ${maxPlay} lượt chơi và nhận được ${totalLixi}k VND`;
  localStorage.setItem("lixi", totalLixi);
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
  localStorage.setItem("lixi", 0);
  maxPlay = 3;
  showMaxPlay.textContent = `Bạn còn ${maxPlay} lượt chơi`;
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

initShakeEvent();
// Gọi hàm yêu cầu quyền khi người dùng bắt đầu tương tác
// document.getElementById("lixiImage").addEventListener("click", initShakeEvent);
