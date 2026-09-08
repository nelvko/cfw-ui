// 从 CFW renderer.js 中抽取所有 CSS 规则(含 \n 转义)输出到文件
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync(
  'C:/Users/issuse/Desktop/app/dist/electron/renderer.js',
  'utf8',
)

const rules = []
// 选择器{...} — 选择器里可能带 [data-v-xxx] / :hover / > 等,体里可有字面 \n
const re = /[^{}]{1,300}\{(?:[^{}]|\\n)*?\}/g
let m
while ((m = re.exec(src))) {
  const raw = m[0]
  // 只要看起来像 CSS 的:含 { 且选择器部分以 . # @ html body : 开头
  const sel = raw.slice(0, raw.indexOf('{'))
  if (!/^\s*[.#@:a-zA-Z*\[]/.test(sel)) continue
  if (!/[a-z-]+\s*:/.test(raw)) continue
  rules.push(raw.replaceAll('\\n', '\n'))
}

console.log('extracted rules:', rules.length)
writeFileSync('.cfw-extract/full.css', rules.join('\n\n'))
