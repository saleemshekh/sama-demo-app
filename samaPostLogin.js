// ===== SAMA POST-LOGIN LIVE - HARD Block =====
async function getRealGPS() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      (err) => reject(err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

async function checkSAMA_PostLogin(action) {
  let result = { risk: 100, accuracy: 10, allowed: true, banner: "" };
  let isFake = localStorage.getItem("FAKE_GPS") === "1";
  let liveText = document.getElementById("liveLoc");
  try {
    let gps = await getRealGPS();
    result.accuracy = Math.round(gps.acc);
    let lat = gps.lat; let lng = gps.lng;
    if(liveText) { liveText.innerText = `📡 LIVE: ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m`; liveText.style.color="green"; }

    if (isFake) {
      lat = 9.0820; lng = 8.6753; result.accuracy = 0; result.risk = 960; result.allowed = false;
      if(liveText) liveText.innerText = `📡 SIMULATED FAKE: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Nigeria)`;
      result.banner = `❌ TRANSFER BLOCKED (${action}): Fake GPS Risk ${result.risk} - SAMA HARD Rule`;
      return result;
    }
    if (lat < 15 || lat > 33 || lng < 33 || lng > 56) result.risk += 500;
    if (gps.acc === 0 || gps.acc > 100) result.risk += 1000;

    if (result.risk >= 500) { result.allowed = false; result.banner = `❌ ${action} BLOCKED: Risk ${result.risk} - Lat:${lat.toFixed(4)} Lng:${lng.toFixed(4)}`; }
    else result.banner = `✅ ${action} ALLOWED: REAL Location ${lat.toFixed(4)}, ${lng.toFixed(4)} Acc:${result.accuracy}m`;
  } catch(e){ result.banner = `GPS Error: ${e}`; }
  return result;
}
function toggleFakeGPS() { let c = localStorage.getItem("FAKE_GPS")==="1"; localStorage.setItem("FAKE_GPS", c?"0":"1"); location.reload(); }