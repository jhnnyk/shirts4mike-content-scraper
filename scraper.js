const fs = require('fs');
const scrapeIt = require('scrape-it');
const converter = require('json-2-csv');

let shirtsArray = [];
let numberOfShirts = 0;

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
    shirt.time = new Date().toString();
    shirtsArray.push(shirt);
    if (numberOfShirts === shirtsArray.length) {
      convert2csv();
    }
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
    numberOfShirts = shirtURLs.shirts.length;
});

// go through the shirts array and parse it as CSV
const json2csvCallback = function (err, csv) {
    if (err) throw err;
    console.log(csv);
};

const convert2csv = function () {
  converter.json2csv(shirtsArray, json2csvCallback);
};
