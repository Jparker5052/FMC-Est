const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dry‐Bulb bins (0–29→0,30–49→1,…,>109→5)
function getDryBulbIndex(tempF) {
  if      (tempF <=  29) return 0;
  else if (tempF <=  49) return 1;
  else if (tempF <=  69) return 2;
  else if (tempF <=  89) return 3;
  else if (tempF <= 109) return 4;
  else                    return 5;
}

// Updated RH bins per your spec
function getRHIndex(rh) {
  const pct = Math.max(0, Math.min(100, Math.round(rh)));
  return Math.floor(pct / 5);
}

app.post("/calculate", (req, res) => {
  try {
    const rawTemp        = parseFloat(req.body.dryBulb);
    const rawRH          = parseFloat(req.body.rh);
    const monthIndex     = parseInt(req.body.month,     10);
    const timeOfDayIndex = parseInt(req.body.timeOfDay, 10);
    const shadingIndex   = parseInt(req.body.shading,   10);
    const aspectIndex    = parseInt(req.body.aspect,    10);
    const slopeIndex     = parseInt(req.body.slope,     10);
    const elevationIndex = parseInt(req.body.elevation, 10);

    const dryBulbIndex = getDryBulbIndex(rawTemp);
    const rhIndex      = getRHIndex(rawRH);

    const args = [
      aspectIndex,
      dryBulbIndex,
      elevationIndex,
      monthIndex,
      rhIndex,
      shadingIndex,
      slopeIndex,
      timeOfDayIndex
    ];

    const proc = spawn(path.join(__dirname, "fuel_moisture"), args);
    let output = "";

    proc.stdout.on("data", d => output += d);
    proc.on("error", err => {
      console.error("spawn error:", err);
      return res.status(500).json({ error: "Failed to start calculation" });
    });
    proc.on("close", code => {
      if (code !== 0) {
        console.error("tool exited with code", code);
        return res.status(500).json({ error: "Calculation error" });
      }
      res.json({ moisture: output.trim() });
    });
  } catch (e) {
    console.error("server error:", e);
    res.status(500).json({ error: "Invalid input" });
  }
});

// your existing GET("/") and listen()...
