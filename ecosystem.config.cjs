module.exports = {
  apps: [
    {
      name: 'focus',
      script: 'server/index.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Restart if memory exceeds 200MB
      max_memory_restart: '200M',
      // Auto restart on crash
      autorestart: true,
      // Log config
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
    },
  ],
}
