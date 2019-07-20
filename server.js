let request = require("request");
let cheerio = require("cheerio");
let URL = require("url-parse");

var START_URL = "https://en.wikipedia.org/wiki/India";
var SEARCH_WORD = "india";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        var isWordFound = searchForWord($, SEARCH_WORD)[0];
        var counting = searchForWord($, SEARCH_WORD)[1];
        console.log(isWordFound);
        console.log(counting);
        if (isWordFound) {
            console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
        } else {
            collectInternalLinks($);
            // In this short program, our callback is just calling crawl()
            callback();
        }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    let counting = 0;
    if (bodyText.indexOf(word.toLowerCase()) != -1) {
        let regex = new RegExp(word, 'g');
        counting = bodyText.match(regex).length;
    }
    return [(bodyText.indexOf(word.toLowerCase()) !== -1), counting];
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}