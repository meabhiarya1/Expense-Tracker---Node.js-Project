const handleSubmit = async (e) => {
  e.preventDefault();

  const newData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // console.log(newData);

  await axios
    .post("http://localhost:3000/user/login", newData)
    .then((res) => {
      console.log(res.status);
      if (res.data.message === "User logged in Successfully") {
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);
        window.location.href = "../ExpenseTracker/index.html";
      }
      else if (res.data.message === "Password is incorrect") {
        alert("Password is incorrect")
      }
      else if (res.data.message === "User not registered") {
        alert("User not registered");
        window.location.href = "../Signup/signup.html";
      }

      else if (res.data.message === "Please fill the fields") {
        alert("Please fill the fields")
      }
    }).catch((err) => {
      console.log(err)
    });

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
};


document.querySelector(".form").addEventListener("submit", handleSubmit);
