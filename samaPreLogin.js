// SAMA Pre-Login - SOFT vs HARD
let currentRisk = 0;

async function checkSAMA_PreLogin(screenName, mode) {
  // Simulate GPS check
  let fakeDetected = localStorage.getItem("FAKE_GPS") === "1";
  let acc = fakeDetected ? 0.0 : 10;
  let ipMismatch = fakeDetected ? true : false;
  
  if (fakeDetected) currentRisk = 960; else currentRisk = 100;
  if (acc === 0.0) currentRisk += 150;

  let result = {
    risk: currentRisk,
    accuracy: acc,
    allowed: true,
    banner: null
  };

  if (mode === "SOFT") {
    if (currentRisk >= 301) {
      result.banner = `⚠️ SAMA WARNING (${screenName}): Fake GPS Risk ${currentRisk} - Login ke baad BLOCK hoga`;
    }
  } else if (mode === "HARD") {
    if (currentRisk >= 301 || acc === 0.0) {
      result.allowed = false;
      result.banner = `❌ SAMA BLOCKED (${screenName}): Risk ${currentRisk} - SAMA Rule se blocked`;
    }
  }
  
  // SAMA Log for Auditor
  console.log(`[SAMA PRE][${screenName}][${mode}] Risk:${result.risk} Acc:${acc} Allowed:${result.allowed}`);
  localStorage.setItem(`SAMA_${screenName}`, JSON.stringify(result));
  return result;
}

// Testing Toggle - Fake GPS ON/OFF
function toggleFakeGPS() {
  let isFake = localStorage.getItem("FAKE_GPS") === "1";
  localStorage.setItem("FAKE_GPS", isFake ? "0" : "1");
  location.reload();
}