// Ask the current tab to analyze the page when popup loads
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkForJobPage" });
  });
});

// Listen for the response from content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const statusElement = document.getElementById("status");

  if (message.jobPage !== undefined) {
    if (message.jobPage) {
      statusElement.textContent = "✅ Hiredd found a Job!";
      statusElement.style.color = "green";
    } else {
      statusElement.textContent = "❌ No job content found.";
      statusElement.style.color = "red";
    }
  }
});
