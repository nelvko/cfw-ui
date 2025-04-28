function useFormatSpeed(val, fractionDigits) {
  const B = 1
  const KB = B << 10
  const MB = KB << 10
  const GB = MB << 10

  let num
  let unit
  if (val < KB) {
    num = val
    unit = 'B'
  } else if (val < MB) {
    num = (val / KB).toFixed(fractionDigits)
    unit = 'KB'
  } else if (val < GB) {
    num = (val / MB).toFixed(fractionDigits)
    unit = 'MB'
  } else {
    num = (val / GB).toFixed(fractionDigits)
    unit = 'GB'
  }
  return { num, unit }
}

export { useFormatSpeed }
