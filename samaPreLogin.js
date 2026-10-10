// ===== SAMA PRE-LOGIN LIVE - SOFT Warning =====
async function getRealGPS_Pre() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      (err) => reject(err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

async function checkSAMA_PreLogin() {
  let result = { risk: 100, accuracy: 10, allowed: true, banner: "" };
  let isFake = localStorage.getItem("FAKE_GPS") === "1";
  let liveText = document.getElementById("liveLocPre");
  try {
    let gps = await getRealGPS_Pre();
    result.accuracy = Math.round(gps.acc);
    let lat = gps.lat; let lng = gps.lng;
    if(liveText) liveText.innerText = `📡 LIVE: ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m`;

    if (isFake) {
      lat = 9.0820; lng = 8.6753; result.accuracy = 0; result.risk = 1110;
      if(liveText) liveText.innerText = `📡 SIMULATED FAKE: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Nigeria)`;
      result.banner = `⚠️ SAMA WARNING Risk ${result.risk}: Suspicious Location ${lat.toFixed(4)} - Login ke baad BLOCK hoga`;
      return result;
    }
    if (lat < 15 || lat > 33 || lng < 33 || lng > 56) result.risk += 500;
    if (gps.acc === 0 || gps.acc > 100) result.risk += 1000;
    
    if (result.risk >= 500) result.banner = `⚠️ SAMA WARNING Risk ${result.risk} - Suspicious but Login ALLOWED (SOFT)`;
    else result.banner = `✅ REAL Location ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m - SAMA ALLOWED`;
  } catch(e){ result.banner = `GPS Error: ${e}`; }
  return result;
}