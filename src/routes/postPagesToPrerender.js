/**
 * Modules
 */
const startPrerendering = require('../pagesProcessing/startPrerendering.js');

/**
 * Export
 */
module.exports = async(request, response) => {

    /* Get the urls for the request */
    const body = await parseBody(request);
    const urls = (JSON.parse(body) || '{}').urls;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        response.writeHead(400);
        return response.end('No urls send.');
    }

    /* Push the urls in the database */
    let bulkOperationAdd = global.mongoBase.collection('urls_to_process').initializeUnorderedBulkOp();
    for (let url of urls)
        bulkOperationAdd.find({ _id: url }).upsert().updateOne({ _id: url });
    bulkOperationAdd.execute();

    /* Remove those urls from the processing collection */
    let bulkOperationDelete = global.mongoBase.collection('urls_processing').initializeUnorderedBulkOp();
    for (let url of urls)
        bulkOperationDelete.find({ _id: url }).remove();
    bulkOperationDelete.execute();

    /* Start prerendering */
    startPrerendering();

    response.writeHead(200);
    return response.end('thanks for the data');

};


/**
 * Promise to parse the body in a synchronous way
 */
const parseBody = (request) => new Promise((resolve, reject) => {

    // Init the body
    let body = [];
    // Each time data are received, we add them to the body
    request.on('data', chunk => body += chunk);
    // When done, the promise resolve and returns the body
    request.on('end', () => resolve(body));
    // If error, the promise rejects
    request.on('error', error => reject(error));

});