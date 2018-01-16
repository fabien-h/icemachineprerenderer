/**
 * Modules
 */
const url = require('url');
const querystring = require('querystring');

/**
 * Export
 */
module.exports = async(request, response) => {

    /* Get the requested page path */
    const pagePath = (querystring.parse(url.parse(request.url).query) || {}).pagepath || null;
    if (!pagePath) {
        response.writeHead(400);
        return response.end('No page asked.');
    }

    /* Get the corresponding page data */
    const pageData = await global.mongoBase.collection('urls_processed').findOne({ _id: pagePath });
    if (!pageData) {
        response.writeHead(404);
        return response.end('Page not found.');
    }

    /* Send it to the client */
    response.writeHead(200);
    return response.end(JSON.stringify(pageData));

};