const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('./.env.production'));

module.exports = {
    apps: [
        {
            name: 'yinav',
            instances: 1,
            script: './funpi.js',
            exec_mode: 'fork',
            watch: false,
            autorestart: true,
            interpreter: 'bun',
            ignore_watch: ['node_modules', 'logs', 'data'],
            env: envConfig,
            log_file: './logs/yinav-tech.log',
            error_file: './logs/yinav-tech-error.log',
            out_file: './logs/yinav-tech-out.log',
            max_memory_restart: '200M'
        }
    ]
};
