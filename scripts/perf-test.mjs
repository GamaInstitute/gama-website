// Performance regression guard for the built site.
//
// Two kinds of check, deliberately kept separate:
//
// 1. Bundle size (deterministic, no timing noise). This is what actually
//    catches the regression class we've hit twice: something that should be
//    lazy-loaded per-page getting pulled into the eager main chunk (e.g.
//    importing framer-motion directly in routes.tsx, the non-lazy root,
//    instead of a route's lazy-loaded page). Zero variance run to run.
//
// 2. Cold-load timing under a throttled CPU (median of 3 runs — a single run
//    in a shared/virtualized environment swings widely enough to trigger
//    false failures unrelated to any code change). This is a secondary,
//    noisier signal for genuine main-thread cost, not the primary gate.
//
// Usage: npm run test:perf

import { spawn } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import puppeteer from 'puppeteer'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PORT = 4174
const BASE_URL = `http://localhost:${PORT}`
const CPU_THROTTLE_RATE = 4 // simulates a mid-range mobile CPU
const RUNS_PER_PAGE = 3

const PAGES = [
  { path: '/',           label: 'Home' },
  { path: '/about',      label: 'About' },
  { path: '/team',       label: 'Team' },
  { path: '/week-paper', label: 'WeekPaper' },
  { path: '/research-summaries', label: 'Research Summaries' },
  { path: '/contact',    label: 'Contact' },
  { path: '/privacy',    label: 'Privacy' },
  { path: '/open-access', label: 'Open access' },
]

// Deterministic — the main eager chunk was 340KB before the framer-motion
// regression and 452KB during it. 400KB sits between the two.
const MAIN_BUNDLE_BUDGET_BYTES = 400 * 1024

// Medians, in ms, with headroom over measured baselines for environment
// noise. A page tripping these is worth investigating — if legitimate new
// weight pushes a page over, raise its budget deliberately rather than
// loosening this file blindly.
const BUDGETS = {
  loadTime:      1800,
  longTaskTotal: 1200,
  scriptDuration: 800,
}

function checkMainBundleSize() {
  const assetsDir = path.join(ROOT, 'dist', 'assets')
  const mainChunk = readdirSync(assetsDir).find(f => /^app-.*\.js$/.test(f))
  if (!mainChunk) throw new Error(`Couldn't find main app-*.js chunk in ${assetsDir} — did the build run?`)
  const size = statSync(path.join(assetsDir, mainChunk)).size
  const ok = size <= MAIN_BUNDLE_BUDGET_BYTES
  const mark = ok ? '✓' : '✗'
  console.log(`${mark} Main bundle (${mainChunk}): ${(size / 1024).toFixed(1)}KB (budget ${(MAIN_BUNDLE_BUDGET_BYTES / 1024).toFixed(0)}KB)`)
  return ok
}

function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url)
        if (res.ok) return resolve()
      } catch (_) { /* not up yet */ }
      if (Date.now() - start > timeoutMs) return reject(new Error(`Server didn't come up within ${timeoutMs}ms`))
      setTimeout(check, 300)
    }
    check()
  })
}

async function measureOnce(browser, path) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  const client = await page.target().createCDPSession()
  await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE })
  await client.send('Performance.enable')
  await page.evaluateOnNewDocument(() => {
    window.__longTasks = []
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__longTasks.push(entry.duration)
    }).observe({ type: 'longtask', buffered: true })
  })

  const t0 = Date.now()
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'load' })
  const loadTime = Date.now() - t0

  const longTasks = await page.evaluate(() => window.__longTasks)
  const metrics = await client.send('Performance.getMetrics')
  const scriptDuration = metrics.metrics.find(m => m.name === 'ScriptDuration').value * 1000

  await context.close()

  return {
    loadTime,
    longTaskTotal: longTasks.reduce((sum, d) => sum + d, 0),
    scriptDuration,
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function checkBudget(label, value, budget) {
  const ok = value <= budget
  const mark = ok ? '✓' : '✗'
  console.log(`    ${mark} ${label}: ${value.toFixed(0)}ms (budget ${budget}ms)`)
  return ok
}

async function main() {
  let allPassed = checkMainBundleSize()

  console.log(`\nStarting preview server on port ${PORT}...`)
  const server = spawn(path.join(ROOT, 'node_modules', '.bin', 'vite'), ['preview', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: 'pipe',
  })
  server.on('error', (err) => { throw err })

  try {
    await waitForServer(BASE_URL)
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

    try {
      for (const { path: routePath, label } of PAGES) {
        const runs = []
        for (let i = 0; i < RUNS_PER_PAGE; i++) runs.push(await measureOnce(browser, routePath))

        const medians = {
          loadTime: median(runs.map(r => r.loadTime)),
          longTaskTotal: median(runs.map(r => r.longTaskTotal)),
          scriptDuration: median(runs.map(r => r.scriptDuration)),
        }

        console.log(`\n${label} (${routePath}) — median of ${RUNS_PER_PAGE} cold loads, ${CPU_THROTTLE_RATE}x CPU throttle`)
        const passes = [
          checkBudget('load time',       medians.loadTime,      BUDGETS.loadTime),
          checkBudget('long-task total', medians.longTaskTotal, BUDGETS.longTaskTotal),
          checkBudget('script execution', medians.scriptDuration, BUDGETS.scriptDuration),
        ]
        if (!passes.every(Boolean)) allPassed = false
      }
    } finally {
      await browser.close()
    }
  } finally {
    server.kill()
  }

  console.log(allPassed ? '\nAll checks within budget.' : '\nOne or more checks exceeded budget.')
  process.exit(allPassed ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
