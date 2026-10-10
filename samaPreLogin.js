// SAMA LIVE GPS - REAL LOCATION
let isFakeMode = false;
let realLat = 0, realLng = 0;

function getLiveLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        realLat = pos.coords.latitude;
        realLng = pos.coords.longitude;
        let acc = pos.coords.accuracy;
        
        // SAMA LOGIC - LIVE DETECTION
        let risk = 100;
        let isMock = false;
        
        // 1. Check accuracy - Fake GPS ka accuracy 0 ya >100 hota hai
        if (acc === 0 || acc > 100) {
          isMock = true;
          risk += 1000;
        }
        
        // 2. Check if location outside KSA (Nigeria etc)
        if (realLat < 15 || realLat > 33 || realLng < 33 || realLng > 56) {
          isMock = true;
          risk += 500;
        }
        
        if (isFakeMode) { // Agar aap test karna chahte ho to
          realLat = 9.0820; // Nigeria
          realLng = 8.6753;
          risk = 1110;
          isMock = true;
        }
        
        // Display
        document.getElementById('gpsInfo').innerText = 
          `Risk:${risk} Acc:${Math.round(acc)} Allowed:${!isMock || risk < 500} | Lat:${realLat.toFixed(4)} Lng:${realLng.toFixed(4)} ${isMock ? 'FAKE' : 'REAL'}`;
        
        if(isMock && risk >= 1000) {
          document.getElementById('warningBox').innerHTML = 
            `⚠️ SAMA WARNING (Splash): Fake GPS Risk ${risk} - Login ke baad BLOCK hoga`;
          document.getElementById('warningBox').style.display = 'block';
        }
      },
      (err) => {
        document.getElementById('gpsInfo').innerText = `GPS Error: ${err.message} - Location permission ON karo`;
      },
      {enableHighAccuracy:true, timeout:10000}
    );
  }
}

function toggleFake() {
  isFakeMode = !isFakeMode;
  getLiveLocation();
  document.getElementById('toggleBtn').innerText = `📍 Toggle Fake GPS (Current: ${isFakeMode ? 'FAKE (Nigeria)' : 'LIVE REAL'})`;
}

// Auto call on load
setTimeout(getLiveLocation, 1000);
setInterval(getLiveLocation, 5000);