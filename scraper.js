const fs = require('fs');
const scrapeIt = require('scrape-it');

// function to scrape info for each individual shirt
const scrapeShirt = (shirt) => {
  scrapeIt("http://www.shirts4mike.com/" + shirt.url, {
    title: "title",
    price: "h1 span",
    imgURL: {
      selector: ".shirt-picture img",
      attr: "src"
    }
  }).then(shirt => {
    shirt.time = new Date();
    console.log(shirt);
  });
};

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
    shirtURLs.shirts.forEach(scrapeShirt);
});
