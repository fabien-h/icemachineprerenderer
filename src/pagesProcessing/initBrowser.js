/**
 * Module
 */
const puppeteer = require('puppeteer');
const initBrowserPage = require('./initBrowserPage.js')
const startPrerendering = require('./startPrerendering.js')

/**
 * Exports
 */
module.exports = async(PAGES_COUNT) => {

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
            '--disable-translate'
        ],
    });

    /* Init the pages */
    for (let i = PAGES_COUNT; i > 0; i--)
        await initBrowserPage();
    console.log('**** APP READY TO PRERENDER ****');

    /* Start the prerendering => will start only if there are pages to render */
    startPrerendering();

};