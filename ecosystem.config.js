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
            },
            args: ["--mongoURL", "mongodb://localhost:27017/local"],
            interpreter: "node",
            node_args: "",
            instances: 1,
            exec_mode: "fork",
            watch: true,
            ignore_watch: ["node_modules", ".git"],
            max_memory_restart: "800M",
            merge_logs: true
        },
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        productionFabien: {
            user: 'fabien',
            host: '67.205.163.60',
            ref: 'origin/master',
            repo: 'https://github.com/fabien-h/icemachineprerenderer.git',
            path: '/var/www/',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        },
    }
};