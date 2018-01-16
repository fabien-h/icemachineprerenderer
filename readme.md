# Goal

[Ice machine website](https://www.icemachinesplus.io/) will serve prerendered version of its pages. The service will serve two purpose :

- It will take a list of URLs on `/postpagestoprerender`. Those URLs will be prerendered with [Chrome Headless](https://developers.google.com/web/updates/2017/04/headless-chrome) and the html content and the meta will be saved in a local MongoDB base.
- It will serve the content cached on `/getprerenderdata?pagePath=__path__`. The main application will request it before serving it to the end client.

# Dev

Make sure you have dependencies installed :

- node (homebrew)
- nodemon (npm)
- pm2 (npm)
- mongo (homebrew)

`npm i` to get the local packages.

To get dev started, in tow terminals :
`npm run dev_server_localDB`
`npm run dev_database`


# Prod

The deployment process is started with `pm2 deploy productionFabien update`. => you will need to duplicate the script with your own user.

Our production server is `67.205.163.60`. Before deployment, you need to install your own SSH keys on the server.

To monitor and debug the service, login to the server with `ssh yourUserName@67.205.163.60` ; then you can launch the monitor with `pm2 monit`.