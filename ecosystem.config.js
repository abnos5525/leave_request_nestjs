module.exports = {
  apps: [
    {
      name: 'leave-request',
      script: './dist/main.js',
      instances: process.env.instances || 1,
      log_date_format: 'DD-MM HH:mm:ss.SSS',
    },
  ],
};
