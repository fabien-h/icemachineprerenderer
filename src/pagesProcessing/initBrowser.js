/**
 * Module
 */
const https = require('https');
const puppeteer = require('puppeteer');
const initBrowserPage = require('./initBrowserPage.js');
const startPrerendering = require('./startPrerendering.js');
const parseString = require('xml2js').parseString;

/**
 * Exports
 */
module.exports = async PAGES_COUNT => {
  global.browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--disable-extensions',
      '--remote-debugging-port=9222',
      '--disable-translate'
    ]
  });

  /* Init the pages */
  for (let i = PAGES_COUNT; i > 0; i--) await initBrowserPage();
  console.log('**** APP READY TO PRERENDER ****');

  /* Get the urls from the site sitemap  */
  https
    .get('https://www.icemachinesplus.io/sitemap.xml', response => {
      let sitemap = '';
      response.on('data', chunk => (sitemap += chunk));

      // The whole response has been received. Print out the result.
      response.on('end', () => {
        return parseString(sitemap, (err, result) => {
          const urls = result.urlset.url.map(u =>
            u.loc[0].replace('https://www.icemachinesplus.io', '')
          );
          /* Push the urls in the database */
          let bulkOperationAdd = global.mongoBase
            .collection('urls_to_process')
            .initializeUnorderedBulkOp();
          for (let url of urls)
            bulkOperationAdd
              .find({ _id: url })
              .upsert()
              .updateOne({ _id: url });
          bulkOperationAdd.execute();

          /* Remove those urls from the processing collection */
          let bulkOperationDelete = global.mongoBase
            .collection('urls_processing')
            .initializeUnorderedBulkOp();
          for (let url of urls) bulkOperationDelete.find({ _id: url }).remove();
          bulkOperationDelete.execute();

          /* Start prerendering */
          return startPrerendering();
        });
      });
    })
    .on('error', error => {
      console.log('Error: ' + error.message);
    });
};
