const fs = require('fs')
const scrapeIt = require('scrape-it')
const converter = require('json-2-csv')

let shirtsArray = []
let numberOfShirts = 0

// if the 'data' directory does not exist, create it
fs.stat('data/', (err, stats) => {
  if (err) {
    fs.mkdirSync('data/')
  }
})

// scrape the index page to get the URLs for each shirt
scrapeIt('http://www.shirts4mike.com/shirts.php', {
  shirts: {
    listItem: '.products li',
    data: {
      url: {
        selector: 'a',
        attr: 'href'
      }
    }
  }
}).then(shirtURLs => {
  shirtURLs.shirts.forEach(scrapeShirt)
  numberOfShirts = shirtURLs.shirts.length
})

// scrape info for each individual shirt
const scrapeShirt = (shirt) => {
  let shirtURL = 'http://www.shirts4mike.com/' + shirt.url

  scrapeIt(shirtURL, {
    title: 'title',
    price: 'h1 span',
    imgURL: {
      selector: '.shirt-picture img',
      attr: 'src'
    }
  }).then(shirt => {
    shirt.url = shirtURL
    shirt.time = new Date().toString()
    shirtsArray.push(shirt)
    if (numberOfShirts === shirtsArray.length) {
      convert2csv()
    }
  })
}

// go through the shirts array and parse it as CSV
const convert2csv = function () {
  converter.json2csv(shirtsArray, write2csv)
}

// create filename from the current date
const createFilename = () => {
  let today = new Date()
  let todaysMonth = ('0' + (today.getMonth() + 1)).slice(-2)
  let todaysDate = ('0' + today.getDate()).slice(-2)
  return today.getFullYear() + '-' + todaysMonth + '-' + todaysDate
}

// write the CSV file
const write2csv = function (err, csv) {
  let csvFilename = createFilename()

  if (err) throw err
  fs.writeFile(`data/${csvFilename}.csv`, csv, (error) => {
    if (error) throw error
    console.log('The file has been saved!')
  })
}
