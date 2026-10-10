// SAMA Post-Login - HARD BLOCK 100%
async function checkSAMA_PostLogin(screenName, amount) {
  let fakeDetected = localStorage.getItem("FAKE_GPS") === "1";
  let acc = fakeDetected ? 0.0 : 12;
  let risk = fakeDetected ? 960 : 120;
  if (acc === 0.0) risk = 1110;

  let allowed = true;
  let reason = "";

  if (risk >= 601 || acc === 0.0) {
    allowed = false;
    reason = `SAMA BLOCK: Risk ${risk} >= 601 + Acc ${acc} = FRAUD`;
  } else if (risk >= 301 && amount >= 1000) {
    allowed = false;
    reason = `SAMA BLOCK: High Value SAR ${amount} + Risk ${risk}`;
  }

  let result = { risk, acc, allowed, reason, refId: "SAMA-" + Date.now() };
  console.log(`[SAMA POST][${screenName}] Risk:${risk} Amount:${amount} Allowed:${allowed}`);
  
  // Block UI show
  if (!allowed) {
    document.getElementById("blockPage").style.display = "block";
    document.getElementById("blockReason").innerText = reason;
    document.getElementById("blockRef").innerText = result.refId;
    document.getElementById("transferForm").style.display = "none";
  }
  return result;
}