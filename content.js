chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkForJobPage") {
      const keywords = [
        'apply',
        'submit application',
        'job description',
        'career',
        'company',
        'vacancy',
        'position',
        'responsibilities',
        'qualifications',
        'hiring',
        'recruiter'
      ];
  
      const pageText = document.body.innerText.toLowerCase();
      const isJobPage = keywords.some(keyword => pageText.includes(keyword));
  
      // Respond back to popup.js
      chrome.runtime.sendMessage({ jobPage: isJobPage });
    }
  });
  