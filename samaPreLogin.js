// samaPreLogin.js - FINAL SAMA LOGIC
// REAL pe sirf REAL, FAKE pe selected country

const REAL_LOC = { lat: 24.6726, lng: 46.7129, acc: 14, city: "Riyadh" };
const FAKE_LOC = { lat: 9.0820, lng: 8.6753, country: "Nigeria", acc: 0, risk: 1110 };

let isFakeMode = localStorage.getItem("fakeMode") === "true";

function renderPreLogin() {
  const locEl = document.getElementById("live-location") || document.getElementById("location-info") || document.body;
  const warnEl = document.getElementById("sama-warning") || document.getElementById("warning-box");
  
  // Console log for SAMA audit
  if (!isFakeMode) {
    console.log(`📡 LIVE: ${REAL_LOC.lat}, ${REAL_LOC.lng} Acc:${REAL_LOC.acc}m`);
    console.log("Toggle: Current: REAL (Riyadh - LIVE)");
    if(locEl) locEl.innerHTML = `📡 LIVE: ${REAL_LOC.lat}, ${REAL_LOC.lng} Acc:${REAL_LOC.acc}m<br>Toggle: Current: REAL (Riyadh - LIVE)<br>✅ REAL Location - No Warning`;
    if(warnEl) warnEl.style.display = "none";
  } else {
    console.log(`📡 SIMULATED FAKE: ${FAKE_LOC.lat}, ${FAKE_LOC.lng} (${FAKE_LOC.country})`);
    console.log(`⚠️ SAMA WARNING Risk ${FAKE_LOC.risk}`);
    if(locEl) locEl.innerHTML = `📡 SIMULATED FAKE: ${FAKE_LOC.lat}, ${FAKE_LOC.lng} (${FAKE_LOC.country}) - Demo Mode<br>Toggle: Current: FAKE (${FAKE_LOC.country})<br>⚠️ Risk:${FAKE_LOC.risk} Acc:0 Allowed:true`;
    if(warnEl) {
      warnEl.style.display = "block";
      warnEl.innerHTML = `⚠️ SAMA WARNING (Splash): Fake GPS Risk ${FAKE_LOC.risk} - Lat:${FAKE_LOC.lat} Lng:${FAKE_LOC.lng} - Login ke baad BLOCK hoga. Acc:0`;
    }
  }
}

// Toggle button function
function toggleFakeGPS() {
  isFakeMode = !isFakeMode;
  localStorage.setItem("fakeMode", isFakeMode);
  renderPreLogin();
  location.reload();
}

document.addEventListener("DOMContentLoaded", renderPreLogin);
renderPreLogin();