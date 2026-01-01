const express = require("express");
const app = express();

// 6-bit Build Logic character map for 0-9 and colon
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

let currentIndex = 0; // which character to send next

app.get("/time", (req, res) => {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins  = String(now.getUTCMinutes()).padStart(2, "0");

  const text = `${hours}:${mins}`; // HH:MM

  // Get character for this request
  const char = text[currentIndex] || " ";
  const charBits = CHAR[char] || "000000";

  // 7th bit = RESET flag (1 for first char)
  const resetBit = currentIndex === 0 ? "1" : "0";

  // 8-bit response: [bit7=0][bit6=RESET][bits5-0=char]
  const response = "0" + resetBit + charBits;

  // Advance index
  currentIndex++;
  if (currentIndex >= text.length) {
    currentIndex = 0; // wrap back to start
  }

  res.send(response); // one character + RESET flag
});

// Optional: reset server index manually
app.get("/reset", (req, res) => {
  currentIndex = 0;
  res.send("00000000");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
