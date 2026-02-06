// A content script is a JavaScript file that runs directly inside web pages that the user visits.

// Toast Message Function
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.innerText = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 9999,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

function detectCompanyName() {
  const metaCompany =
    document.querySelector('meta[property="og:site_name"]')?.content ||
    document.querySelector('meta[name="application-name"]')?.content ||
    document.querySelector('meta[property="og:title"]')?.content;

  const title = document.title;
  const fromTitle = title.match(/(?:Careers at|Jobs at)?\s*(.*?)(?:\s*[-|—])/i)?.[1];

  const domain = window.location.hostname.replace("www.", "").split(".")[0];

  const footerText = document.querySelector("footer")?.innerText;
  const fromFooter = footerText?.match(/©\s*(\d{4})?\s*(.*)/i)?.[2];

  return (
    metaCompany?.trim() ||
    fromTitle?.trim() ||
    fromFooter?.trim() ||
    domain?.trim() ||
    "Unknown"
  );
}

function isLikelyJobPage() {
  const bodyText = document.body.innerText.toLowerCase();
  return bodyText.includes("engineer") ||
         bodyText.includes("backend") ||
         bodyText.includes("software") ||
         bodyText.includes("hiring") ||
         bodyText.includes("we are hiring") ||
         bodyText.includes("open role");
}

function extractJobDetails() {
  let role = document.querySelector('h1, h2, .job-title')?.innerText || "Unknown Role";
  let company = document.querySelector('.company, .company-name, .org, .topcard__org-name-link')?.innerText || detectCompanyName();
  let url = window.location.href;

  const jobData = { role, company, url };

  // Store in chrome.storage.local
  chrome.storage.local.set({ jobData }, () => {
    console.log("Job data saved to chrome.storage.local:", jobData);
  });

  // Post to API
  fetch('https://system-backend-hprl.onrender.com/api/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: role,
      company: company,
      link: url
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    console.log('Job posted successfully:', data);
    showToast("✅ Job posted successfully!");
  })
  .catch(error => {
    console.error('Error posting job:', error);
    showToast("❌ Error posting job: " + error.message);
  });
}

if (isLikelyJobPage()) {
  extractJobDetails();
} else {
  console.log("Not a job page.");
}
