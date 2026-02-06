chrome.storage.local.get("jobData", (result) => {
  const status = document.getElementById("status");
  const role = document.getElementById("role");
  const company = document.getElementById("company");

  if (result.jobData) {
    status.textContent = "Job page detected";
    role.textContent = "Role: " + result.jobData.role;
    company.textContent = "Company: " + result.jobData.company;
  } else {
    status.textContent = "Not a job page";
  }
});
