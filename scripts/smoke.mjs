// 冒烟脚本:驱动系统 Chrome 逐页截图,收集控制台错误
// 用法:SHOT_DIR=<dir> node scripts/smoke.mjs
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const OUT = process.env.SHOT_DIR ?? '.smoke'
const PORT = process.env.PORT ?? '5173'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
// CFW 默认窗口逻辑尺寸 850×603(main.js width:850 height:603)
const page = await browser.newPage({ viewport: { width: 850, height: 603 } })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto(`http://localhost:${PORT}`)
await page.evaluate(() => localStorage.clear())
await page.reload()
await page.waitForSelector('text=常规', { timeout: 15000 })
await page.waitForTimeout(1500) // 等 mock 数据流动起来
await page.screenshot({ path: `${OUT}/1-general.png` })

const pages = [
  ['代理', '2-proxies'],
  ['配置', '3-profiles'],
  ['日志', '4-logs'],
  ['连接', '5-connections'],
  ['规则', '6-rules'],
  ['设置', '7-settings'],
  ['反馈', '8-feedback'],
]
for (const [label, name] of pages) {
  await page.click(`li.menu-item:has-text("${label}")`)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

// 主题抽查:深色 / 国庆中秋 / 赛博朋克
const themeSel = 'select.as-text:has(option[value="dark"])'
await page.click('li.menu-item:has-text("设置")')
await page.selectOption(themeSel, 'dark')
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/10-dark-settings.png` })
await page.click('li.menu-item:has-text("代理")')
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/11-dark-proxies.png` })

await page.click('li.menu-item:has-text("设置")')
await page.selectOption(themeSel, 'red')
await page.click('li.menu-item:has-text("代理")')
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/12-red-proxies.png` })

await page.click('li.menu-item:has-text("设置")')
await page.selectOption(themeSel, '2077')
await page.click('li.menu-item:has-text("代理")')
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/13-cyberpunk-proxies.png` })

console.log('console errors:', errors.length ? JSON.stringify(errors, null, 2) : 'none')
await browser.close()
