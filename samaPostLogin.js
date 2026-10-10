// samaPostLogin.js - FINAL SAMA LOGIC
// REAL pe Riyadh ALLOWED, FAKE pe Nigeria BLOCKED

const REAL_LOC = { lat: 24.6726, lng: 46.7129, acc: 14, city: "Riyadh" };
const FAKE_LOC = { lat: 9.0820, lng: 8.6753, country: "Nigeria", acc: 0, risk: 960 };

let isFakeMode = localStorage.getItem("fakeMode") === "true";

function renderPostLogin() {
  const dashEl = document.getElementById("dashboard-info") || document.getElementById("live-location") || document.body;
  const transferEl = document.getElementById("transfer-info") || document.getElementById("transfer-box");

  if (!isFakeMode) {
    // FAKE GPS OFF - Pre login REAL tha, Post login bhi REAL
    console.log(`✅ Dashboard ALLOWED: REAL ${REAL_LOC.lat}, ${REAL_LOC.lng} Acc:${REAL_LOC.acc}m`);
    if(dashEl) dashEl.innerHTML = `✅ Dashboard ALLOWED: REAL Location ${REAL_LOC.lat}, ${REAL_LOC.lng} Acc:${REAL_LOC.acc}m<br>Risk:100 Acc:${REAL_LOC.acc} Allowed:true<br>💰 SAR 50,000 - Riyadh`;
    if(transferEl) transferEl.innerHTML = `✅ Transfer ALLOWED<br>Risk:100 Acc:${REAL_LOC.acc} Allowed:true<br>Screen 2: Dashboard + Transfer`;
  } else {
    // FAKE GPS ON - Jis country ka on hai usi country ka dikhana, POST me BLOCK
    console.log(`❌ TRANSFER BLOCKED Risk ${FAKE_LOC.risk} - ${FAKE_LOC.country}`);
    if(dashEl) dashEl.innerHTML = `❌ TRANSFER BLOCKED (Dashboard): Fake GPS Risk ${FAKE_LOC.risk} - Lat:${FAKE_LOC.lat} Lng:${FAKE_LOC.lng} - ${FAKE_LOC.country} - SAMA HARD Rule<br>Risk:${FAKE_LOC.risk} Acc:0 Allowed:false`;
    if(transferEl) transferEl.innerHTML = `💰 SAR 50,000 - BLOCKED!<br>Risk:${FAKE_LOC.risk} Acc:0 Allowed:false<br>💸 Transfer Screen - HARD Block<br>SAMA Rule: Transfer pe Fake GPS = BLOCK`;
  }
}

function toggleFakeGPS() {
  isFakeMode = !isFakeMode;
  localStorage.setItem("fakeMode", isFakeMode);
  renderPostLogin();
  location.reload();
}

document.addEventListener("DOMContentLoaded", renderPostLogin);
renderPostLogin();