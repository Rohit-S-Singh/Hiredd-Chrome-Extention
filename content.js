(function initHiredPanel() {
  if (document.getElementById("hired-fab") || document.getElementById("hired-panel")) return;

  // ========== FLOATING ICON ==========
  const hiredBtn = document.createElement("img");
  hiredBtn.id = "hired-fab";
  hiredBtn.src = "https://i.ibb.co/sJFrmkjG/icon.png";
  Object.assign(hiredBtn.style, {
    position: "fixed",
    top: "50%",
    right: "0",
    transform: "translateY(-50%)",
    width: "42px",
    height: "42px",
    background: "#fff",
    border: "2px solid #0073ff",
    borderRadius: "50% 0 0 50%",
    cursor: "pointer",
    padding: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    zIndex: "2147483647",
  });
  document.body.appendChild(hiredBtn);

  // ========== PANEL ==========
  const panel = document.createElement("div");
  panel.id = "hired-panel";
  Object.assign(panel.style, {
    position: "fixed",
    top: "0",
    right: "0",
    height: "100vh",
    width: "320px",
    background: "#ffffff",
    color: "#000",
    borderLeft: "1px solid #e5e7eb",
    boxShadow: "0 0 20px rgba(0,0,0,0.25)",
    transform: "translateX(100%)",
    transition: "transform 220ms ease",
    zIndex: "2147483646",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, sans-serif",
  });

  const closeHandle = document.createElement("button");
  closeHandle.textContent = "‹";
  Object.assign(closeHandle.style, {
    position: "absolute",
    left: "-28px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "28px",
    height: "56px",
    border: "1px solid #e5e7eb",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "20px",
    color: "#000",
  });

  const header = document.createElement("div");
  header.textContent = "Candidate Info";
  Object.assign(header.style, {
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0f0",
    fontWeight: "600",
    fontSize: "15px",
  });

  const content = document.createElement("div");
  content.id = "hired-content";
  content.style.padding = "16px";
  content.style.fontSize = "14px";
  content.style.color = "#000";
  content.textContent = "Loading...";

  panel.appendChild(closeHandle);
  panel.appendChild(header);
  panel.appendChild(content);
  document.body.appendChild(panel);

  // ========== OPEN / CLOSE ==========
  let isOpen = false;
  hiredBtn.onclick = () => {
    isOpen ? panel.style.transform = "translateX(100%)" : panel.style.transform = "translateX(0)";
    isOpen = !isOpen;
  };
  closeHandle.onclick = () => { panel.style.transform = "translateX(100%)"; isOpen = false; };

  // ========== FETCH USER USING JWT TOKEN ==========
  async function fetchUser() {
    const token = localStorage.getItem("jwtToken"); // <<---- IMPORTANT CHANGE

    if (!token) {
      content.innerHTML = `
        <div style="font-size:15px; font-weight:600; margin-bottom:10px;">Not Logged In</div>
        <div style="margin-bottom:16px;">Please login to your Hired account to view your profile info.</div>
        <a href="https://hired-eta.vercel.app/" target="_blank" style="
          display:block;
          padding:10px;
          background:#0073ff;
          color:#fff;
          text-align:center;
          border-radius:8px;
          text-decoration:none;">
          Login to Hired
        </a>
      `;
      return;
    }

    try {
      const res = await fetch("https://system-backend-hprl.onrender.com/api/get-user-by-email", {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      const u = data.user;


      content.innerHTML = `
  <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
    <img src="${u.picture}" style="width:60px; height:60px; border-radius:50%; border:1px solid #ccc;">
    <div>
      <div style="font-size:16px; font-weight:600;">${u.name}</div>
      <div style="font-size:13px; opacity:0.7;">${u.email}</div>
    </div>
  </div>

  <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
    <div><strong>Mentor:</strong> ${u.isMentor ? "Yes" : "No"}</div>
    <div><strong>Total Experience:</strong> ${(u.mentorProfile?.experience || "-")} years</div>
    <div><strong>Expertise:</strong> ${u.mentorProfile?.expertise?.join(", ") || "-"}</div>
    <div><strong>Bio:</strong> ${u.mentorProfile?.bio || "-"}</div>
  </div>

  <!-- NEW EMAIL SECTION -->
  <div style="padding:12px; border:1px solid #ddd; border-radius:8px; display:flex; flex-direction:column; gap:12px;">

    <div style="font-weight:600; font-size:15px;">
      Send Cold Email
    </div>

    <!-- Recruiter Email Input -->
    <input 
      id="recruiterEmail"
      type="email"
      placeholder="Enter recruiter's email"
      style="width:100%; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px;"
    />

    <!-- Send Button -->
    <button id="sendEmailBtn"
      style="background:#007bff; border:none; padding:10px 14px; color:white; border-radius:6px; cursor:pointer; font-size:14px;">
      Send Email
    </button>

    <!-- View/Edit Template -->
    <button
      onclick="window.open('YOUR_TEMPLATE_URL', '_blank')"
      style="background:#f1f1f1; border:1px solid #ccc; padding:10px 14px; border-radius:6px; cursor:pointer; font-size:14px;">
      View / Edit Email Template ✏️
    </button>

  </div>
`;

    
      
    } catch (err) {
      console.error(err);
      content.innerHTML = "Error loading data.";
    }
  }

  fetchUser();

})();
