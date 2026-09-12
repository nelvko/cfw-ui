const KB = 1 << 10
const MB = KB << 10
const GB = MB << 10

// 移植自老项目 hooks/formatSpeed.js
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
