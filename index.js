const express = require("express");
const app = express();

/*
6-bit character table (only what we need for time)
*/
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
  ":": "101001", // semicolon shifted = colon
  " ": "000000"
};

function encode(text) {
  return text
    .split("")
    .map(c => CHAR[c] || "000000")
    .join("");
}

app.get("/time", (req, res) => {
  const now = new Date();

  // UTC time (no timezone headaches)
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins  = String(now.getUTCMinutes()).padStart(2, "0");

  const text = `${hours}:${mins}`;
  const encoded = encode(text);

  // IMPORTANT: raw binary, not JSON
  res.send(encoded);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
