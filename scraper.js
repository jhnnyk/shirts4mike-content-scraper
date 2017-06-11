const fs = require('fs');
const scrapeIt = require('scrape-it');
const converter = require('json-2-csv');

let shirtsArray = [];
let numberOfShirts = 0;

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

// scrape info for each individual shirt
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

// go through the shirts array and parse it as CSV
const convert2csv = function () {
  converter.json2csv(shirtsArray, write2csv);
};

// write the CSV file
const write2csv = function (err, csv) {
    if (err) throw err;
    console.log(csv);
};
