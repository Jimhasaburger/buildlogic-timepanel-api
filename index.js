app.get("/time", (req, res) => {
  const now = new Date();

  const hours = String(now.getUTCHours()).padStart(2, "0");
  const mins  = String(now.getUTCMinutes()).padStart(2, "0");

  const text = `${hours}:${mins}`; // e.g. "12:45"

  // which character index are we requesting?
  const id = Number(req.query.id || 0);

  if (id < 0 || id >= text.length) {
    // send blank
    res.send("00000000");
    return;
  }

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
    ":": "101001"
  };

  const sixBit = CHAR[text[id]] || "000000";

  // pad to 8 bits for HTTP Transmitter
  const eightBit = "00" + sixBit;

  res.send(eightBit);
});
