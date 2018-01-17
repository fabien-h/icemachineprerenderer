/**
 * Exports
 */
module.exports = async () => {
  /* Init the page and block all the unwanted requests */
  let page = await global.browser.newPage();
  page.removeAllListeners();
  await page.setRequestInterception(true);
  page.on('request', request => {
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
  await page.goto('https://www.icemachinesplus.io/');
  await page.waitForSelector('#prerenderForHeadlessReady', { timeout: 15000 });

  console.log('page initialized');

  /* Put the page in the pages array with status ready */
  return global.browserPages.push({
    page,
    status: 'ready'
  });
};
