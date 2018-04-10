/**
 * Modules
 */
const puppeteer = require('puppeteer');

/**
 * Export
 */
module.exports = async () => {
  askForPrerendering();
};

async function askForPrerendering() {
  /* Get the next URL to process */
  let urlToProcess = await global.mongoBase
    .collection('urls_to_process')
    .findOne();
  if (!urlToProcess) return false;
  urlToProcess = urlToProcess._id;

  /* Send it to the first available page */
  const targetPage = global.browserPages.find(url => url.status === 'ready');
  if (!targetPage) return false;
  targetPage.status = 'busy';
  await global.mongoBase
    .collection('urls_to_process')
    .deleteOne({ _id: urlToProcess });
  await global.mongoBase
    .collection('urls_processing')
    .insert({ _id: urlToProcess });

  /* Call the prerender */
  prerender(targetPage, urlToProcess);

  /* Restart the loop */
  return setTimeout(askForPrerendering);
}

async function prerender(targetPage, path) {
  console.log('Start prerendering : ' + path);
  console.time('Rendered : ' + path);
  const page = targetPage.page;

  await page.evaluate(`ReactionRouter.go('/')`);
  await page.evaluate(`ReactionRouter.go('${path}')`);
  let ready = false;
  try {
    await page.waitForSelector('#prerenderForHeadlessReady', {
      timeout: 15000
    });
    if (/\/product\//.test(path)) {
      await page.waitForSelector('.yotpo-logo-title', {
        timeout: 15000
      });
    }
    ready = true;
  } catch (error) {
    console.log(error);
    console.log('Error when prerendering page : ' + path);
  }

  if (ready) {
    const title = await page.evaluate(
      `(document.querySelector('title') || {} ).textContent || ''`
    );
    const description = await page.evaluate(
      `(document.querySelector('meta[name="description"]') || {} ).content || ''`
    );
    const image = await page.evaluate(
      `(document.querySelector('meta[property="og:image"]') || {} ).content || ''`
    );
    const price = await page.evaluate(
      `(document.querySelector('meta[property="product:price:amount"]') || {}).content || ''`
    );
    const brand = await page.evaluate(
      `(document.querySelector('meta[property="og:brand"]') || {}).content || ''`
    );
    const keywords = await page.evaluate(
      `(document.querySelector('meta[name="keywords"]') || {} ).content || ''`
    );
    const content = await page.$eval('#react-root', el => el.outerHTML || null);

    await global.mongoBase
      .collection('urls_processing')
      .deleteOne({ _id: path });
    await global.mongoBase.collection('urls_processed').update(
      {
        _id: path
      },
      {
        _id: path,
        html: content,
        meta: `
<title>${title}</title>
<meta name="description" content="${description}" >
<meta name="keywords" content="${keywords}" >
<meta property="twitter:title" content="${title}" >
<meta property="twitter:description" content="${description}" >
<meta property="og:title" content="${title}" >
<meta property="og:description" content="${description}" >
<meta property="og:image" content="${image}" >
<meta property="og:type" content="og:product" >
<meta property="og:site_name" content="IceMachine+" >
<meta property="og:url" content="https://www.icemachinesplus.io${path}" >
<meta property="og:brand" content="${brand}" >
<meta property="og:availability" content="instock" >
<meta property="product:price:currency" content="USD" >
<meta property="product:price:amount" content="${price}" >
<link rel="canonical" href="https://www.icemachinesplus.io${path}" >`,
        lastUpdate: new Date()
      },
      {
        upsert: true
      }
    );
  }
  console.timeEnd('Rendered : ' + path);

  /* Set the page back to available */
  targetPage.status = 'ready';

  /* Restart the loop */
  return setTimeout(askForPrerendering);
}
