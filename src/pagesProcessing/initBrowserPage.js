/**
 * Modules
 */
const startPrerendering = require('../pagesProcessing/startPrerendering.js');

/**
 * Exports
 */
module.exports = async () => {
  return await initPage();
};

async function initPage() {
  /* Init the page and block all the unwanted requests */
  let exportedPage = {
    page: await global.browser.newPage(),
    status: 'ready'
  };
  exportedPage.page.removeAllListeners();

  console.log('start init page');

  // Page crash => remove and recreate one
  await exportedPage.page.on('error', () => {
    exportedPage.status = 'ready';
    startPrerendering();
  });

  // Error on the page => be ready and start next one
  await exportedPage.page.on('pageerror', () => console.error('page error'));

  /* Intercept the type of requests that we do not want to load */
  await exportedPage.page.setRequestInterception(true);
  exportedPage.page.on('request', request => {
    if (
      request.url.indexOf('https://www.icemachinesplus.io') === -1 ||
      ['Stylesheet', 'Image', 'Media', 'Font'].includes(request.resourceType) ||
      /\.(png|jpg|jpeg|gif|svg|webp|css|woff2|bmp|mp4|eot|woff|ttf)$/i.test(
        request.url
      )
    )
      request.abort();
    else request.continue();
  });

  /* Get the home page to initialize the data and the websocket */
  await exportedPage.page.goto('https://www.icemachinesplus.io/');
  await exportedPage.page.waitForSelector('#prerenderForHeadlessReady', {
    timeout: 15000
  });

  console.log('page initialized');

  /* Put the page in the pages array with status ready */
  return global.browserPages.push(exportedPage);
}
