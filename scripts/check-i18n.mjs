// 核对页面/组件用到的 i18n key 是否在 zh/en 中均有定义
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const i18n = readFileSync('src/i18n.js', 'utf8')
const defs = new Set()
for (const m of i18n.matchAll(/^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z][\w ]*))\s*:/gm)) {
  defs.add(m[1] || m[2] || m[3])
}

const used = new Set()
const files = []
for (const d of ['src/pages', 'src/components']) {
  for (const f of readdirSync(d)) files.push(join(d, f))
}
for (const f of files) {
  const s = readFileSync(f, 'utf8')
  for (const m of s.matchAll(/t\('([^']+)'\)/g)) used.add(m[1])
}

const missing = [...used].filter((k) => !defs.has(k))
console.log('used keys:', used.size, '| defined keys:', defs.size)
console.log('MISSING:', missing.length ? missing.join(', ') : '(none)')
