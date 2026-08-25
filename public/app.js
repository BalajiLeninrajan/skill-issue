const form = document.getElementById("hope-form");
const formContainer = document.getElementById("form-container");
const confirmation = document.getElementById("confirmation");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Remove existing error if any
  const existingError = document.querySelector(".error");
  if (existingError) existingError.remove();

  const companyName = document.getElementById("company").value.trim();
  const jobTitle = document.getElementById("job-title").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!companyName || !jobTitle || !email) {
    showError("Please fill in all fields.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Registering hope...";

  try {
    const response = await fetch("/api/register-hope", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName, jobTitle, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    formContainer.classList.add("hidden");
    confirmation.classList.remove("hidden");
  } catch (err) {
    showError(err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "I Have Hope";
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  confirmation.classList.add("hidden");
  formContainer.classList.remove("hidden");
  submitBtn.disabled = false;
  submitBtn.textContent = "I Have Hope";
});

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error banner cn-tone-red";
  errorDiv.textContent = message;
  form.insertBefore(errorDiv, form.firstChild);
}
