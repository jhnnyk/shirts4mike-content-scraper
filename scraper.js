const fs = require('fs');
const scrapeIt = require('scrape-it');

// if the 'data' directory does not exist, create it
fs.stat("data/", (err, stats) => {
  if (err) {
    fs.mkdirSync("data/");
  }
});

// scrape the index page to get the URLs for each shirt
scrapeIt("http://www.shirts4mike.com/shirts.php", {
    shirts: {
        listItem: ".products li",
        data: {
            url: {
              selector: "a",
              attr: "href"
            }
        }
    }
}).then(shirtURLs => {
    console.log(shirtURLs);
});
