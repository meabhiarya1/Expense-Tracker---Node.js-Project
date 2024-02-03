const token = localStorage.getItem('token');

const btnBuyPremium = document.getElementById("rzp-button1");
const premium = document.getElementById("premium");
const downloadButton = document.getElementById("download");
const btnLeaderBoard = document.getElementById("btn_leader_board");
const leaderBoardTitle = document.getElementById("leader_board_title");
const leaderBoardList = document.getElementById("leader_board_list");
const totalexpense = document.getElementById("totalexpense");
const btnDownloadHistory = document.getElementById("btn_download_history");
const DownloadHistoryTitle = document.getElementById("download_history_title");
const DownloadHistoryContainer = document.getElementById("download_history_container");
const DownloadHistoryList = document.getElementById("download_history_list");

const pagination = document.getElementById("pagination");
const rowsPerPage = document.getElementById("rowsperpage");
const btnrows = document.getElementById("btnrows");
const itemList = document.getElementById("items");


const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const displayProduct = async (expense) => {
    // await axios
    //     .get("http://localhost:3000/expense/get-expenses", { headers: { "Authorization": token } })
    //     .then((res) => {
    //         const expenses = res.data;
    //         console.log(expenses.length)
    const ul = document.getElementById("expenseData");
    ul.textContent = "";
    console.log(expense)

    // expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.textContent = `Expense: ${expense.expensePrice} - Description: ${expense.expenseDescription} - Category: ${expense.expenseCategory}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editData(expense);
    li.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteData(expense.id);
    li.appendChild(deleteButton);
    ul.appendChild(li);
    // });
};
// function to handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
        expensePrice: document.getElementById("expensePrice").value,
        expenseDescription: document.getElementById("expenseDescription").value,
        expenseCategory: document.getElementById("expenseCategory").value,
    };

    console.log(newData);
    // const token = localStorage.getItem('token');

    await axios
        .post("http://localhost:3000/expenses/add-expense", newData, { headers: { "Authorization": token } })
        .then((res) => {
            // displayProduct();
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err.data);
        });

    document.getElementById("expensePrice").value = "";
    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseCategory").value = "";
};

const deleteData = (index) => {
    axios
        .delete(`http://localhost:3000/expense/delete-expense/${index}`, { headers: { "Authorization": token } })
        .then((res) => {
            displayProduct();
        })
        .catch((err) => {
            console.log(err.data);
        });
    displayProduct();
};

const editData = (expense) => {
    document.getElementById("expensePrice").value = expense.expensePrice;
    document.getElementById("expenseDescription").value =
        expense.expenseDescription;
    document.getElementById("expenseCategory").value = expense.expenseCategory;

    deleteData(expense.id);
    displayProduct();
};

const ispremium = async (e) => {
    const response = await axios.get(
        "http://localhost:3000/user/ispremiumuser",
        {
            headers: { Authorization: token },
        }
    );
    const premiumuser = response.data;
    localStorage.setItem("pro", premiumuser);
    if (response.data) {
        btnBuyPremium.remove();
        const premiumUser = document.createElement("h3");
        premiumUser.textContent = "Premium Member";
        premium.appendChild(premiumUser);
        btnLeaderBoard.style.display = "inline-block";
        downloadButton.style.display = "inline-block";
        btnDownloadHistory.style.display = "inline-block";
    }
};

const showAllDownloads = (obj) => {
    console.log(obj)
    const tr = document.createElement("tr");
    const urlTh = document.createElement("th");
    const a = document.createElement("a");
    a.href = obj.url;
    a.textContent = "Download";
    urlTh.appendChild(a);
    const dateTh = document.createElement("th");
    dateTh.textContent = obj.createdAt;
    tr.appendChild(urlTh);
    tr.appendChild(dateTh);
    DownloadHistoryList.appendChild(tr);
}

const showLeaderBoard = (obj) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent =
        "Name" +
        " - " +
        obj.name +
        " " +
        " " +
        "Total Expenses" +
        " - " +
        obj.totalExpenses;
    leaderBoardList.appendChild(li);
}

const showTotalExpense = (data) => {
    const parseData = parseJwt(token)
    // console.log(parseData.userId)
    const userId = data.filter(user => {
        return user.id === parseData.userId;
    })
    // console.log(userId[0].id)
    totalexpense.style.display = "block";
    totalexpense.textContent = `Your Total Expenses: ${userId[0].totalExpenses}`;
}

const showpagination = ({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    lastPage,
}) => {
    pagination.innerHTML = "";
    if (hasPreviousPage) {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.addEventListener("click", () => showExpenses(previousPage));
        pagination.appendChild(btn2);
    }
    const btn1 = document.createElement("button");
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener("click", () => showExpenses(currentPage));
    pagination.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.addEventListener("click", () => showExpenses(nextPage));
        pagination.appendChild(btn3);
    }
    if (lastPage > 2 && lastPage > nextPage) {
        const btn4 = document.createElement("button");
        btn4.innerHTML = lastPage;
        btn4.addEventListener("click", () => showExpenses(lastPage));
        pagination.appendChild(btn4);
    }
}

const showExpenses = async (page) => {
    try {
        const numberOfRows = localStorage.getItem("rows") || 10;

        const response = await axios.get(`http://localhost:3000/expenses/getexpenses`, { page, numberOfRows },
            { headers: { "Authorization": token } }
        );
        listExpenses(response.data.Expenses);
        showpagination(response.data);
    } catch (error) {
        console.log(error)
    }
}

const listExpenses = (expenses) => {
    itemList.innerHTML = "";
    for (let i = 0; i < expenses.length; i++) {
        show(expenses[i]);
    }
}

const show = (expense) => {
    const ul = document.getElementById("expenseData");
    ul.textContent = "";
    console.log(expense)

    const li = document.createElement("li");
    li.textContent = `Expense: ${expense.expensePrice} - Description: ${expense.expenseDescription} - Category: ${expense.expenseCategory}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editData(expense);
    li.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteData(expense.id);
    li.appendChild(deleteButton);
    ul.appendChild(li);
}

btnBuyPremium.onclick = async (e) => {
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } });
            alert("You are a Premium User Now");
            ispremium();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
        console.log(response)
        alert("Payment Failed!!!!");
    });
};

btnDownloadHistory.onclick = async () => {
    try {
        const response = await axios.get("http://localhost:3000/premium/alldownloadhistory", { headers: { Authorization: token } });
        DownloadHistoryList.innerHTML = "";
        const arr = response.data.downloadHistory;
        for (let i = 0; i < arr.length; i++) {
            showAllDownloads(arr[i]);
        }
    } catch (error) {
        console.log(error)
    }
}

btnLeaderBoard.onclick = async () => {
    try {
        leaderBoardTitle.textContent = "Leader Board";
        const response = await axios.get("http://localhost:3000/premium/showleaderboard",
            { headers: { Authorization: token } }
        );
        const data = response.data;
        showTotalExpense(data)
        leaderBoardList.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            showLeaderBoard(data[i]);
        }
    } catch (error) {
        console.log(error);
    }

};

downloadButton.onclick = async () => {
    try {
        if (localStorage.getItem("pro")) {
            const response = await axios.get("http://localhost:3000/premium/download", {
                headers: { Authorization: token },
            }
            );
            if (response.status === 200) {
                let a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = "myexpense.csv";
                a.click();
            } else {
                throw new Error(response.data.message);

            }
        }
    } catch (error) {
        // showError(error);
        console.log(error);
    }
}

btnrows.onclick = async () => {
    const rows = rowsPerPage.value;
    rowsPerPage.value = "";
    if (rows > 0) {
        const page = 1;
        localStorage.setItem("rows", rows);
        const numberOfRows = localStorage.getItem("rows");
        console.log(page,numberOfRows,'-----------------')
        const response = await axios.get(`http://localhost:3000/expenses/getexpenses`, { page, numberOfRows }, { headers: { "Authorization": token } });
        console.log("My>>>>>>>>>>>>>>>>>>",response.data)
        listExpenses(response.data.Expenses);
        showpagination(response.data);
    }
};

logout.onclick = () => {
    localStorage.clear();
    window.location.href = "../login/login.html";
};

document.querySelector(".form").addEventListener("submit", handleSubmit);
ispremium();
// displayProduct();