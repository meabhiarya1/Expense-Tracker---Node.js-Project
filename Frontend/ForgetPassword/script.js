const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
        email: document.getElementById("email").value,
    };

    // console.log(newData);

    await axios.post("http://localhost:3000/password/forgotpassword", newData)
        .then((res) => {
            alert(res.data.msg);
        }).catch((err) => {
            console.log(err)
        });

    document.getElementById("email").value = "";
};

document.querySelector(".form").addEventListener("submit", handleSubmit);
