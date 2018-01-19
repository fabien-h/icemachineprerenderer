/**
 * Modules
 */
const http = require("http");
const url = require("url");
const mongodb = require("mongodb");

const getPrerenderData = require('./src/routes/getPrerenderData.js');
const postPagesToPrerender = require('./src/routes/postPagesToPrerender.js');
const initBrowser = require('./src/pagesProcessing/initBrowser.js');

/**
 * Connect to the mongo database
 */
 global.mongoBase;
 let mongoBaseUrl;
 if (process.argv.indexOf('--mongoURL') === -1)
 console.error('mongoURL is not set');
 else mongoBaseUrl = process.argv[process.argv.indexOf('--mongoURL') + 1];
 mongodb.MongoClient.connect(mongoBaseUrl, (err, client) => {
   if (err) return console.error('Connection to database failed');
   console.log('Service started');
   global.mongoBase = client.db('local');
  });

/**
 * Init pupeteer the browser pages
 */
 global.browser;
 global.browserPages = [];
 const PAGES_COUNT = 1;
 initBrowser(PAGES_COUNT);

/**
 * The server will serve only two route :
 *      - /getprerenderdata
 *      - /buildprerenderdata
 */
const server = http.createServer((request, response) => {
  // Will answer to our two routes
  // otherwise, answer a 403
  switch (url.parse(request.url).pathname) {
    case "/getprerenderdata":
      getPrerenderData(request, response, mongoBase);
      break;
    case "/postpagestoprerender":
      postPagesToPrerender(request, response, mongoBase);
      break;
    default:
      response.writeHead(403);
      response.end("IceMachine prerenderer ; you have nothing to do there.");
      break;
  }
});

server.listen(8080);
console.log("***** APP STARTED *****");
