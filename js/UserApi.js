const submitBtn = document.getElementById("submit");
// lấy dữ liệu từ API
const signUp = (userObj) => {
  //goi api
  const res = axios({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${BASE_URL}/api/Users/signup`,
    method: "POST",
    data: userObj,
  });

  //kiem tra api
  res
    .then((result) => {
      alert("ban da dang ky thanh cong");
    })
    .catch((err) => {
      console.log(err);
    });
};

const validateData = (userObj, confirm) => {
  const user = new User(userObj);
  console.log(userObj);
  const { name, email, password, gender, phone } = user;
  if (!name || !email || !password || !confirm || !phone || !gender) {
    console.log("object");
    alert("vui long dien vao form");
    return false;
  }
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexEmail.test(email)) {
    alert("email sai cu phap");
    return false;
  }

  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!regexPassword.test(password)) {
    alert(
      "Password phai co it nhat 8 ky tu bao gom chu va so, 1 ky tu in hoa va 1 ky tu dac biet "
    );
    return false;
  }
  if (password !== confirm) {
    alert("password k giong confirm");
    return false;
  }
  const regexPhone = /^[0-9]{10,}$/;
  if (!regexPhone.test(phone)) {
    alert("phone k dung");
    return false;
  }

  return true;
};

// signUp("");

//lay du lieu tu UI
const getFormData = () => {
  const email = document.getElementById("txtEmail").value;
  const name = document.getElementById("txtName").value;
  const password = document.getElementById("txtPassword").value;
  const phone = document.getElementById("txtPhone").value;
  const confirm = document.getElementById("txtConfirm").value;
  const gender = document.querySelector(
    '.register__wrap-check input[name="inlineRadioOptions"]:checked'
  ).value;

  const userObj = new User({
    email,
    name,
    password,
    phone,
    gender: true,
  });
  const validate = validateData(userObj, confirm);
  if (validate) {
    signUp(userObj);
  }
  //   signUp(userObj);
};

submitBtn.addEventListener("click", (event) => {
  getFormData();
});
