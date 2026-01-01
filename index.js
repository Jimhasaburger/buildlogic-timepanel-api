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

let currentIndex = 0;

// Main /time endpoint — returns one 8-bit character per GET
app.get("/time", (req, res) => {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins  = String(now.getUTCMinutes()).padStart(2, "0");
  const text = `${hours}:${mins}`;

  const char = text[currentIndex] || " ";
  const charBits = CHAR[char] || "000000";

  // bit 6 = RESET flag
  const resetBit = currentIndex === 0 ? "1" : "0";

  const response = "0" + resetBit + charBits; // 8-bit: [unused][RESET][char]

  // increment index
  currentIndex++;
  if (currentIndex >= text.length) currentIndex = 0;

  res.send(response);
});

// Optional reset endpoint
app.get("/reset", (req, res) => {
  currentIndex = 0;
  res.send("00000000");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
