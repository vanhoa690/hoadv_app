const url = "https://api.webopsagency.com";
function handleRegiter() {
  document
    .getElementById("formRegister")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputName = document.querySelector("#name");
      const inputMsv = document.querySelector("#msv");
      const inputEmail = document.querySelector("#email");
      const inputPassword = document.querySelector("#password");
      const inputRePassword = document.querySelector("#rePassword");

      if (!inputName.value) {
        alert("Không để trống Họ và tên");
        inputName.focus();
        return;
      }

      if (!inputMsv.value) {
        alert("Không để trống Mã sinh viên");
        inputMsv.focus();
        return;
      } else if (inputMsv.value.length != 7) {
        alert("Mã sinh viên phải đủ 7 ký tự");
        inputMsv.focus();
        return;
      }

      if (!inputEmail.value) {
        alert("Không để trống email");
        inputEmail.focus();
        return;
      }

      if (!inputPassword.value) {
        alert("Không để trống password");
        inputPassword.focus();
        return;
      } else if (inputPassword.value.length < 6) {
        alert("Password cần tối thiểu 6 kí tự");
        inputPassword.focus();
        return;
      }

      if (inputPassword.value != inputRePassword.value) {
        alert("Password và Re-Password không trùng nhau");
        inputRePassword.focus();
        return;
      }

      const data = {
        fullname: inputName.value,
        studentid: inputMsv.value,
        email: inputEmail.value,
        password: inputPassword.value,
      };

      try {
        const res = await fetch(`${url}/register`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          window.location = "login.html";
          alert("Đăng kí thành công, vui lòng xác thực tại địa chỉ email");
        } else {
          const dataRes = await res.json();
          alert(dataRes?.message);
        }
      } catch (error) {
        alert(error);
      }
    });
}

handleRegiter();

function handleLogin() {
  document
    .getElementById("formLogin")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputEmail = document.querySelector("#email");
      const inputPassword = document.querySelector("#password");

      if (!inputEmail.value) {
        alert("Không để trống email");
        inputEmail.focus();
        return;
      }

      if (!inputPassword.value) {
        alert("Không để trống password");
        inputPassword.focus();
        return;
      } else if (inputPassword.value.length < 6) {
        alert("Password cần tối thiểu 6 kí tự");
        inputPassword.focus();
        return;
      }

      const data = {
        email: inputEmail.value,
        password: inputPassword.value,
      };

      try {
        const res = await fetch(`${url}/login`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const resData = await res.json();

        if (res.ok) {
          sessionStorage.setItem("user", JSON.stringify(resData?.user));
          sessionStorage.setItem("token", resData?.token);
          alert("Đăng nhập thành công");
          location.replace("/");
        } else {
          alert(resData?.message);
        }
      } catch (error) {
        alert(error);
      }
    });
}

handleLogin();
