# Goal

[Ice machine website](https://www.icemachinesplus.com/) will serve prerendered version of its pages. The service will serve two purpose :

* It will take a list of URLs on `/postpagestoprerender`. Those URLs will be prerendered with [Chrome Headless](https://developers.google.com/web/updates/2017/04/headless-chrome) and the html content and the meta will be saved in a local MongoDB base.
* It will serve the content cached on `/getprerenderdata?pagePath=__path__`. The main application will request it before serving it to the end client.

> Every 10 hours, the service will fetch the current sitemap and regenerate everything

# Dev

Make sure you have dependencies installed :

* node (homebrew)
* nodemon (npm)
* pm2 (npm)
* mongo (homebrew)

`npm i` to get the local packages.

To get dev started, in tow terminals :
`npm run dev_server_localDB`
`npm run dev_database`

# Prod

The deployment process is started with `pm2 deploy productionFabien update`. => you will need to duplicate the script with your own user.

Our production server is `67.205.163.60`. Before deployment, you need to install your own SSH keys on the server.

To monitor and debug the service, login to the server with `ssh yourUserName@67.205.163.60` ; then you can launch the monitor with `pm2 monit`.

We need to have a cron that destroy all the chrome instances and restart the pm2 process every 30 minutes. SO, `crontab -e` and :

    */30 * * * * killall chrome; pm2 kill ; pm2 flush; cd ; cd /var/www/current; pm2 start pm2.json --no-daemon

* kill all the chrome instances
* kill all the node processes
* flush the logs
* go to the current directory
* start the node process
