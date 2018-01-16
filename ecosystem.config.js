module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'icemachineprerenderer',
            script: 'server.js',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'node',
            host: '67.205.163.60',
            ref: 'origin/master',
            repo: 'git@github.com:fabien-h/icemachineprerenderer.git',
            path: '/var/www/',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        },
    }
};