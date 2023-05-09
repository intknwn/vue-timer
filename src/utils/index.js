export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })

export const prepareTimer = (timer, id) => {
  const { hours = 0, minutes = 0, seconds = 0 } = timer
  const value = +(hours * 3600 + minutes * 60 + seconds)

  return {
    id,
    name: timer.name,
    seconds: value,
    currentValue: value,
    repeat: timer.repeat,
    repeatCounter: 0,
    isActive: false,
    isDone: false,
  }
}

export const formatPresetValue = (value) => {
  const [h, m, s] = new Date(value * 1000)
    .toISOString()
    .slice(11, 19)
    .split(':')

  const hours = parseInt(h) !== 0 ? `${parseInt(h)} HOURS` : ''
  const minutes = parseInt(m) !== 0 ? `${parseInt(m)} MIN` : ''
  const seconds = parseInt(s) !== 0 ? `${parseInt(s)} SEC` : ''

  return `${hours} ${minutes} ${seconds}`
}
