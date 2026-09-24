import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = (env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
    ],
    server: {
      proxy: {
        '/status': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/auth': {
          target: backendUrl,
          changeOrigin: true,
          autoRewrite: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['location']) {
                proxyRes.headers['location'] = proxyRes.headers['location'].replace(
                  /^https?:\/\/[^/]+/,
                  ''
                );
              }
            });
          },
        },
        '/admin': {
          target: backendUrl,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['location']) {
                proxyRes.headers['location'] = proxyRes.headers['location'].replace(
                  /^https?:\/\/[^/]+/,
                  ''
                );
              }
            });
          },
        },
      },
    },
  };
});
