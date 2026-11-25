import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === 'development'

  return {
    base: '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      standalonePageScript(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
  }
})

// The delivered page uses a classic script for file:// compatibility.
// Keep it intact in production Vite builds as well.
function standalonePageScript(): Plugin {
  return {
    name: 'standalone-page-script',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(
        '<script defer src="./main.js">',
        '<script defer vite-ignore src="./main.js">',
      ),
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'main.js',
        source: fs.readFileSync(path.resolve(import.meta.dirname, 'main.js'), 'utf8'),
      })
    },
  }
}
