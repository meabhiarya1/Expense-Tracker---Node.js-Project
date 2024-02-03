const handleSubmit = async (e) => {
  e.preventDefault();

  const newData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    number: document.getElementById("number").value,
    password: document.getElementById("password").value,
  };

  // console.log(newData);

  await axios
    .post("http://localhost:3000/user/signup", newData)
    .then((res) => {
      console.log(res.status);
      if (res.data.message === "Email already exists") {
        alert("Email already exists")
      }
      else{
        alert("User Created")
        window.location.href = "../Login/login.html";
      }
    }).catch((err) => {
      console.log(err)
    });

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("number").value = "";
  document.getElementById("password").value = "";
};


document.querySelector(".form").addEventListener("submit", handleSubmit);
