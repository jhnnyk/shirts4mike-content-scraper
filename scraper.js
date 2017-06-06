const fs = require('fs');

// if the 'data' directory does not exist, create it
fs.stat("data/", (err, stats) => {
  if (err) {
    fs.mkdirSync("data/");
  }
});
