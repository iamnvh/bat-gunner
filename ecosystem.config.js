module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      out_file: '../logs/dev/user.log',
      error_file: '../logs/dev/user.err',
      log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
      watch: false,
      kill_timeout: 10000,
      max_memory_restart: '1024M',
      autorestart: true,
      instances: 1,
      script: 'dist/main.js', // Đường dẫn đến tệp chạy ứng dụng
      // instances: 'max', // Số lượng instances (processes) muốn chạy, 'max' nghĩa là sử dụng hết tài nguyên
      exec_mode: 'cluster', // Chế độ chạy ứng dụng (cluster hoặc fork)
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
