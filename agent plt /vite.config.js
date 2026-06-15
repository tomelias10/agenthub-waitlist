import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// Load .env (token, board id) into process.env for the dev API below.
function loadDotEnv() {
  try {
    for (const line of readFileSync(resolve('.env'), 'utf8').split('\n')) {
      if (line.trim().startsWith('#') || !line.includes('=')) continue
      const i = line.indexOf('=')
      const k = line.slice(0, i).trim()
      const v = line.slice(i + 1).trim()
      if (k && !(k in process.env)) process.env[k] = v
    }
  } catch {
    /* no .env — fine */
  }
}

// Dev-only: run the Netlify function for /api/demo so the form works on
// `npm run dev` without the Netlify CLI. Production uses the real function.
function mondayDevApi() {
  return {
    name: 'orynval-monday-dev-api',
    apply: 'serve',
    configureServer(server) {
      loadDotEnv()
      server.middlewares.use('/api/demo', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method not allowed')
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          try {
            const mod = await import(
              pathToFileURL(resolve('netlify/functions/demo.js')).href
            )
            const result = await mod.handler({ httpMethod: 'POST', body })
            res.statusCode = result.statusCode
            res.setHeader('Content-Type', 'application/json')
            res.end(result.body)
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mondayDevApi()],
})
