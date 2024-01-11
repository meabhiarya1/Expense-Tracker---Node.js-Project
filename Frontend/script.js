const existingUserButton = document.getElementById("existing-user-button");
const submitButton = document.getElementById("submit-button");
const nameField = document.querySelector(".name-field");
const numberField = document.querySelector(".number-field");

existingUserButton.addEventListener("click", () => {
  if (submitButton.textContent !== "Log In") {
    nameField.style.display = "none";
    numberField.style.display = "none";
    submitButton.textContent = "Log In";
    submitButton.type = "button"; // Prevent form submission on click
    existingUserButton.textContent = "Register Here";
  } else {
    nameField.style.display = "flex"; // Show the fields
    numberField.style.display = "flex";
    submitButton.textContent = "Sign Up";
    submitButton.type = "button"; // Prevent form submission on click
    existingUserButton.textContent = "Existing User";
  }
});
