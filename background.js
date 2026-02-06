chrome.runtime.onInstalled.addListener(() => {
    console.log("Hiredd Extension Installed");
  });


  const callWeb = async (userEmail) => {
   
  }



  chrome.runtime.onStartup.addListener(async () => {
    const URL = `https://system-backend-hprl.onrender.com/api/get-user-by-email?email=rohitshekrsingh@gmail.com`;
  
    const response = await fetch(URL);
    
    const data = await response.json();
  
    console.log(data);
  
    // Save data in extension storage
    await chrome.storage.local.set({ startupInfo: data });
  
    console.log("Saved data to storage:", data);
  });