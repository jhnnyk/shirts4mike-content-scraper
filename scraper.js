const fs = require('fs');
const scrapeIt = require('scrape-it');

// if the 'data' directory does not exist, create it
fs.stat("data/", (err, stats) => {
  if (err) {
    fs.mkdirSync("data/");
  }
});

// scrape the webpage
scrapeIt("http://www.irunfar.com/", {
    articles: {
        listItem: ".noFeat",
        data: {
            title: "h5",
            excerpt: ".excerpt"
        }
    }
}).then(page => {
    console.log(page);
});
