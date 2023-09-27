// rule validate (những yêu cầu để công nhận là validate)
// email: isRequired, isEmail
// name: isRequired, isName(có thể là tiếng việt, tiếng anh, max 50)
// Gender: isRequired
// Country: isRequired
// password: isRequired, min 8, max 30
// ConfirmedPassword: isRequired, mix 8, max 30, isSame(password)
// agree: isRequired

const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

// Viết những hàm nhận vào value và kiểm tra value theo 1 tiêu chí gì đó
// nếu như value đó hợp lệ thì return ""
// Không hợp lệ thì return 1 chuỗi báo lỗi

const isRequired = (value) => (value !== "" ? "" : "That field is required");
const isEmail = (value) => (REG_EMAIL.test(value) ? "" : "Email is not valid");
const isName = (value) => (REG_NAME.test(value) ? "" : "Name is not valid");
const min = (num) => (value) => {
  return value.length >= num ? "" : `Min is ${num}`;
};
const max = (num) => (value) => {
  return value.length <= num ? "" : `Max is ${num}`;
};
const isSame = (paramValue, fieldName1, fieldName2) => (value) => {
  return paramValue == value
    ? ""
    : `${fieldName1} is not same with ${fieldName2}`;
};

// Ta sẽ có 1 object có cấu trúc như sau:
// value: giá trị của controlNode
// Function: mảng các hàm mà value cần check
// ParentNode: là cha của controlNode cần chèn câu invalid-feedback
// ControlNodes: các element dạng input

// Hàm tạo thông báo invalid-feedback
const createMsg = (parentNode, controlNodes, msg) => {
  // tạo div có nội dung invalid-feedback
  const invalidDiv = document.createElement("div");
  invalidDiv.className = "invalid-feedback";
  invalidDiv.innerHTML = msg;
  parentNode.appendChild(invalidDiv);
  controlNodes.forEach((inputItem) => {
    inputItem.classList.add("is-invalid");
  });
};
// demo xài hàm
// let inputName = document.querySelector("#name");
// createMsg(inputName.parentElement, [inputName], isRequired(inputName.value));

// Viết 1 hàm nhận vào paraObject có dạng {value, funcs, parentNode, controlNodes}
// sẽ cho value chạy qua từng hàm trong mảng funcs để kiểm tra
// nếu trong quá trình kiểm tra trả ra chuỗi "báo lỗi" thì dùng createMsg để hiển thị

const isValid = (paraObject) => {
  // destructuring
  const { value, funcs, parentNode, controlNodes } = paraObject;
  // duyệt mảng các funcs, funcCheck có thể đại diện cho isRequired, isName,...
  for (const funcCheck of funcs) {
    let msg = funcCheck(value);
    if (msg) {
      createMsg(parentNode, controlNodes, msg);
      // nếu value is not valid thì vừa hiển thị lỗi, vừa return chuỗi lỗi
      return msg;
    }
  }
  // Nếu value is valid thì return rỗng
  return "";
};

// Hàm xóa hết các thông báo lỗi trên UI
const clearMsg = () => {
  document.querySelectorAll(".is-invalid").forEach((inputItem) => {
    inputItem.classList.remove("is-invalid");
  });
  document.querySelectorAll(".invalid-feedback").forEach((divMsg) => {
    divMsg.remove();
  });
};

// Sự kiện diễn ra
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); // chặn reset trang
  clearMsg();
  let emailNode = document.querySelector("#email");
  let nameNode = document.querySelector("#name");
  let genderNode = document.querySelector("#gender");
  // Có thể người dùng không chọn, ta bị null
  let countryNode = document.querySelector("input[name='country']:checked"); // checked: chỉ lấy thằng được tick
  let passwordNode = document.querySelector("#password");
  let confirmedpasswordNode = document.querySelector("#confirmedPassword");
  let agreeNode = document.querySelector("input#agree:checked");

  const errorMsg = [
    // Email
    isValid({
      value: emailNode.value,
      funcs: [isRequired, isEmail],
      parentNode: emailNode.parentElement,
      controlNodes: [emailNode],
    }),

    // Name
    isValid({
      value: nameNode.value,
      funcs: [isRequired, isName, max(50)],
      parentNode: nameNode.parentElement,
      controlNodes: [nameNode],
    }),

    // Gender
    isValid({
      value: genderNode.value,
      funcs: [isRequired],
      parentNode: genderNode.parentElement,
      controlNodes: [genderNode],
    }),

    // Country
    isValid({
      // nếu có value thì gán không thì chuỗi rỗng (vì country có thể null)
      value: countryNode ? countryNode.value : "",
      funcs: [isRequired],
      parentNode: document.querySelector(".form-check-country").parentElement,
      controlNodes: document.querySelectorAll("input[name='country']"),
    }),

    // password
    isValid({
      value: passwordNode.value,
      funcs: [isRequired, min(8), max(30)],
      parentNode: passwordNode.parentElement,
      controlNodes: [passwordNode],
    }),

    // confirmedPassword
    isValid({
      value: confirmedpasswordNode.value,
      funcs: [
        isRequired,
        min(8),
        max(30),
        isSame(passwordNode.value, "Password", "ConfirmedPassword"),
      ],
      parentNode: confirmedpasswordNode.parentElement,
      controlNodes: [confirmedpasswordNode],
    }),

    // agree
    isValid({
      value: agreeNode ? agreeNode.value : "",
      funcs: [isRequired],
      parentNode: document.querySelector("input#agree").parentElement,
      controlNodes: [document.querySelector("input#agree")],
    }),
  ];

  const isValidForm = errorMsg.every((item) => !item);
  if (isValidForm) {
    clearMsg();
    alert("Your submit is accepted!");
  }
});
