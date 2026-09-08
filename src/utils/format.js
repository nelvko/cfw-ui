const KB = 1 << 10
const MB = KB << 10
const GB = MB << 10

// 移植自老项目 hooks/formatSpeed.js
export function fmtSpeed(bytes) {
  const { num, unit } = fmtSpeedParts(bytes)
  return `${num} ${unit}`
}

export function fmtSpeedParts(bytes) {
  let num
  let unit
  if (bytes < KB) {
    num = bytes
    unit = 'B/s'
  } else if (bytes < MB) {
    num = (bytes / KB).toFixed(1)
    unit = 'KB/s'
  } else if (bytes < GB) {
    num = (bytes / MB).toFixed(2)
    unit = 'MB/s'
  } else {
    num = (bytes / GB).toFixed(2)
    unit = 'GB/s'
  }
  return { num, unit }
}

export function fmtBytes(bytes) {
  if (bytes <= 0) return '0 B'
  let num
  let unit
  if (bytes < KB) {
    num = bytes
    unit = 'B'
  } else if (bytes < MB) {
    num = (bytes / KB).toFixed(1)
    unit = 'KB'
  } else if (bytes < GB) {
    num = (bytes / MB).toFixed(2)
    unit = 'MB'
  } else {
    num = (bytes / GB).toFixed(2)
    unit = 'GB'
  }
  return `${num} ${unit}`
}

export function fmtDuration(startISO) {
  const ms = Date.now() - new Date(startISO).getTime()
  if (ms < 0 || Number.isNaN(ms)) return '-'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h${m % 60}m${s % 60}s`
  if (m > 0) return `${m}m${s % 60}s`
  return `${s}s`
}

export function fmtTime(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function fmtDateTime(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
