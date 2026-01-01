// Step 0 — import express
const express = require("express");
const app = express(); // THIS creates the app object

// 6-bit Build Logic character map
const CHAR = {
  "0": "100100",
  "1": "011011",
  "2": "011100",
  "3": "011101",
  "4": "011110",
  "5": "011111",
  "6": "100000",
  "7": "100001",
  "8": "100010",
  "9": "100011",
  ":": "101001",
  " ": "000000"
};

// ===== CONFIG =====
// Read UTC offset from environment variable, default to 1
const UTC_OFFSET = parseInt(process.env.UTC_OFFSET || "1", 10);

let currentIndex = 0;

// Main /time endpoint — returns one 8-bit character per GET
app.get("/time", (req, res) => {
  const now = new Date();

  // Apply UTC offset
  let hours = now.getUTCHours() + UTC_OFFSET;
  if (hours >= 24) hours -= 24;
  if (hours < 0) hours += 24;
  hours = String(hours).padStart(2, "0");

  const mins    = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  const text = `${hours}:${mins}:${seconds}`; // HH:MM:SS

  const char = text[currentIndex] || " ";
  const charBits = CHAR[char] || "000000";

  // bit 6 = RESET flag
  const resetBit = currentIndex === 0 ? "1" : "0";

  const response = "0" + resetBit + charBits; // 8-bit: [unused][RESET][char]

  // increment index
  currentIndex++;
  if (currentIndex >= text.length) currentIndex = 0;

  // Send JSON response
  res.json({ value: response });
});

// Optional reset endpoint
app.get("/reset", (req, res) => {
  currentIndex = 0;
  res.json({ value: "00000000" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
