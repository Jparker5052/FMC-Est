const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// map °F into 0–5 bins
function getDryBulbIndex(tempF) {
  if      (tempF <=  29) return 0;
  else if (tempF <=  49) return 1;
  else if (tempF <=  69) return 2;
  else if (tempF <=  89) return 3;
  else if (tempF <= 109) return 4;
  else                    return 5;
}

// map RH% into your 21 bins: 0–4→0, 5–9→1, …, 95–99→19, 100→20
function getRHIndex(rh) {
  const pct = Math.max(0, Math.min(100, Math.round(rh)));
  return Math.floor(pct / 5);
}

// map raw month (0=Jan … 11=Dec) into your 3 ranges:
//  0: May/June/July  (4,5,6)
//  1: Feb/Mar/Apr/Aug/Sep/Oct  (1,2,3,7,8,9)
//  2: Nov/Dec/Jan  (10,11,0)
function getMonthRangeIndex(rawMonth) {
  if ([4,5,6].includes(rawMonth))       return 0;
  else if ([1,2,3,7,8,9].includes(rawMonth)) return 1;
  else                                    return 2;
}

app.post("/calculate", (req, res) => {
  try {
    // Parse raw inputs
    const aspectIndex    = parseInt(req.body.aspect,    10);
    const rawTemp        = parseFloat(req.body.dryBulb);
    const elevationIndex = parseInt(req.body.elevation, 10);
    const rawMonth       = parseInt(req.body.month,     10);
    const rawRH          = parseFloat(req.body.rh);
    const shadingIndex   = parseInt(req.body.shading,   10);
    const slopeIndex     = parseInt(req.body.slope,     10);
    const timeOfDayIndex = parseInt(req.body.timeOfDay, 10);

    // Compute tool indices
    const dryBulbIndex   = getDryBulbIndex(rawTemp);
    const rhIndex        = getRHIndex(rawRH);
    const monthIndex     = getMonthRangeIndex(rawMonth);

    // Build args in the exact order expected by calculateByIndex:
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

    console.log("---- calculate called ----");
    console.log("Raw inputs:", {
      dryBulb: rawTemp,
      rh: rawRH,
      month: rawMonth,
      timeOfDay: timeOfDayIndex,
      shading: shadingIndex,
      aspect: aspectIndex,
      slope: slopeIndex,
      elevation: elevationIndex
    });
    console.log("Mapped indices:", {
      dryBulbIndex,
      rhIndex,
      monthIndex,
      timeOfDayIndex,
      shadingIndex,
      aspectIndex,
      slopeIndex,
      elevationIndex
    });
    console.log("Spawning:", path.join(__dirname, "fuel_moisture"), args.join(" "));

    const proc = spawn(path.join(__dirname, "fuel_moisture"), args);
    let output = "";

    proc.stdout.on("data", d => {
      output += d;
      console.log("  stdout chunk:", d.toString().trim());
    });
    proc.stderr.on("data", d => {
      console.error("  stderr chunk:", d.toString());
    });
    proc.on("error", err => {
      console.error("spawn error:", err);
      return res.status(500).json({ error: "Failed to start calculation" });
    });
    proc.on("close", code => {
      console.log("Process exited with code", code);
      if (code !== 0) {
        return res.status(500).json({ error: "Calculation error" });
      }
      console.log("Final output:", output.trim());
      res.json({ moisture: output.trim() });
    });

  } catch (e) {
    console.error("server error:", e);
    res.status(500).json({ error: "Invalid input" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
