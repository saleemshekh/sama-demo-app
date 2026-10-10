// ===== SAMA POST-LOGIN LIVE GPS - Riyadh =====

async function getRealGPS() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { 
      reject("GPS not supported"); 
      return; 
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ 
        lat: pos.coords.latitude, 
        lng: pos.coords.longitude, 
        acc: pos.coords.accuracy 
      }),
      (err) => reject(err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

async function checkSAMA_PostLogin(action) {
  let result = { risk: 100, accuracy: 10, allowed: true, banner: "" };
  let isFakeToggle = localStorage.getItem("FAKE_GPS") === "1";
  let liveText = document.getElementById("liveLoc");
  
  try {
    let gps = await getRealGPS();
    result.accuracy = Math.round(gps.acc);
    let lat = gps.lat; 
    let lng = gps.lng;
    
    if(liveText) {
      liveText.innerText = `📡 LIVE: ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m`;
      liveText.style.color = "green";
    }

    // FAKE TOGGLE CHECK - Nigeria
    if (isFakeToggle) {
      lat = 9.0820; 
      lng = 8.6753; 
      result.accuracy = 0; 
      result.risk = 960;
      if(liveText) {
        liveText.innerText = `📡 SIMULATED FAKE: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Nigeria)`;
      }
      result.allowed = false;
      result.banner = `❌ TRANSFER BLOCKED (${action}): Fake GPS Risk ${result.risk} - Lat:${lat.toFixed(4)} Lng:${lng.toFixed(4)} - SAMA HARD Rule`;
      return result;
    }

    // REAL CHECK - Outside KSA or bad accuracy
    if (lat < 15 || lat > 33 || lng < 33 || lng > 56) { 
      result.risk += 500; 
    }
    if (gps.acc === 0 || gps.acc > 100) { 
      result.risk += 1000; 
    }

    if (result.risk >= 500) {
      result.allowed = false;
      result.banner = `❌ ${action} BLOCKED: Risk ${result.risk} - Suspicious Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } else {
      result.banner = `✅ ${action} ALLOWED: REAL Location ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m`;
    }
  } catch (e) {
    result.banner = `GPS Error: ${e}`;
    if(liveText) {
      liveText.innerText = `❌ GPS Error: ${e}`;
      liveText.style.color = "red";
    }
  }
  return result;
}

function toggleFakeGPS() {
  let current = localStorage.getItem("FAKE_GPS") === "1";
  localStorage.setItem("FAKE_GPS", current ? "0" : "1");
  let status = document.getElementById("gpsStatus");
  if(status) {
    status.innerText = !current ? "FAKE (Nigeria)" : "REAL (Riyadh - LIVE)";
  }
  initDashboard();
}

async function initDashboard() {
  let status = document.getElementById("gpsStatus");
  if(status) {
    status.innerText = localStorage.getItem("FAKE_GPS")==="1" ? "FAKE (Nigeria)" : "REAL (Riyadh - LIVE)";
  }
  
  let r = await checkSAMA_PostLogin("Dashboard");
  
  let logDash = document.getElementById("logDash");
  if(logDash) logDash.innerText = `Risk:${r.risk} Acc:${r.accuracy} Allowed:${r.allowed}`;
  
  let b = document.getElementById("samaBanner");
  if(b) {
    b.innerText = r.banner; 
    b.style.display = "block";
    b.className = r.allowed ? "banner success" : "banner block";
  }
}

async function testTransfer() {
  let r = await checkSAMA_PostLogin("Transfer");
  
  let logTransfer = document.getElementById("logTransfer");
  if(logTransfer) logTransfer.innerText = `Risk:${r.risk} Acc:${r.accuracy} Allowed:${r.allowed}`;
  
  let b = document.getElementById("samaBanner");
  if(b) {
    b.innerText = r.banner; 
    b.style.display = "block";
    b.className = r.allowed ? "banner success" : "banner block";
  }
  
  if(!r.allowed) alert(r.banner);
  else alert("✅ Transfer SUCCESS - REAL GPS: "+r.accuracy+"m");
}

// Auto LIVE Update
initDashboard();
setInterval(initDashboard, 5000);

export { checkSAMA_PostLogin, toggleFakeGPS, initDashboard, testTransfer, getRealGPS };