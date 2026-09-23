const $ = (s) => document.querySelector(s);
const form = $("#hope-form");
const company = $("#company");
const jobTitle = $("#job-title");
const email = $("#email");
const submitBtn = $("#submit-btn");
const resetBtn = $("#reset-btn");

const EMAIL_HELP = "The rejection goes here. Nothing else does.";
const EMAIL_FIX = "Use a full address, like name@example.com.";

const headings = {
  form: "Tell us where you <em>applied</em>. We send the <em>rejection</em>.",
  confirm: "Your <em>rejection</em> is on its way.",
  error: "Your hope <em>bounced</em>.",
};

// One sentence per failure the server can return, plus the empty form.
const errors = {
  email: "That email address doesn't look real, so fix it and send again.",
  missing: "Every field needs something in it, so fill them in and send again.",
  long: "One of those is longer than we accept, so trim it and send again.",
  server: "Something broke on our side, so give it a minute and send again.",
};

// The preview fills in as the user types. The placeholders stand in until then.
function fill() {
  const c = company.value.trim() || "TechCorp Inc.";
  const j = jobTitle.value.trim() || "Senior Software Engineer";
  document.querySelectorAll('[data-fill="company"]').forEach((n) => (n.textContent = c));
  document.querySelectorAll('[data-fill="job"]').forEach((n) => (n.textContent = j));
}

function show(state, lede, invalid = []) {
  document.body.dataset.state = state;
  $("#si-heading").innerHTML = headings[state];
  $("#si-lede").textContent = lede;
  form.classList.toggle("cn-hidden", state === "confirm");
  $("#again").classList.toggle("cn-hidden", state !== "confirm");

  for (const input of [company, jobTitle, email]) {
    if (invalid.includes(input)) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
  $("#email-help").textContent = invalid.includes(email) ? EMAIL_FIX : EMAIL_HELP;

  const tag = $("#status");
  tag.textContent = state === "confirm" ? "Scheduled" : "Draft";
  tag.className = "tag " + (state === "confirm" ? "cn-tone-green" : "cn-tone-mauve");
}

function showForm() {
  show("form", "It lands in your inbox within 48 hours, so you can stop refreshing.");
}

function setBusy(busy) {
  submitBtn.disabled = busy;
  submitBtn.setAttribute("aria-busy", String(busy));
}

function fail(kind, invalid = []) {
  setBusy(false);
  show("error", errors[kind], invalid);
  (invalid[0] || submitBtn).focus();
}

form.addEventListener("input", fill);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    companyName: company.value.trim(),
    jobTitle: jobTitle.value.trim(),
    email: email.value.trim(),
  };

  const empty = [
    [company, body.companyName],
    [jobTitle, body.jobTitle],
    [email, body.email],
  ].filter(([, v]) => !v).map(([input]) => input);
  if (empty.length) return fail("missing", empty);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return fail("email", [email]);

  setBusy(true);
  try {
    const response = await fetch("/api/register-hope", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      show("confirm", `It reaches ${body.email} within 48 hours, so check spam before you get excited.`);
      resetBtn.focus();
    } else if (data.error === "Invalid email format") {
      fail("email", [email]);
    } else if (data.error === "Input too long") {
      fail("long");
    } else if (response.status === 400) {
      fail("missing");
    } else {
      fail("server");
    }
  } catch {
    fail("server");
  } finally {
    setBusy(false);
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  fill();
  showForm();
  company.focus();
});
