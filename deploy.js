'use strict';

const ExecSync = require( 'child_process' ).execSync;

console.log( 'start deploying' );

// Upload package.json and update dependencies
/*
console.time( 'install dependencies' );
ExecSync( `scp ${ __dirname }/package.json fabien@67.205.163.60:/var/www` );
ExecSync( `scp ${ __dirname }/pm2.json fabien@67.205.163.60:/var/www` );
ExecSync( `ssh fabien@67.205.163.60 'cd /var/www && rm -rf node_modules'` );
ExecSync( `ssh fabien@67.205.163.60 'cd /var/www && npm i'` );
console.timeEnd( 'install dependencies' );
*/

// Upload server. This is done after the dependencies
// upload because the server upload will trigger the
// app reload ; so we need the dependencies to be
// updated before
console.time( 'upload server' );
ExecSync( `scp -rp ${ __dirname }/src/. fabien@67.205.163.60:/var/www` );
console.timeEnd( 'upload server' );
