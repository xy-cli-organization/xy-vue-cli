/**
 * Format Time
 * @param date
 * @returns {string}
 * @description dateFormat('Dec 27, 2019 3:18:14 PM') to '2019-12-27 15:18:14'
 */

export const dateFormat = (date) => {
  if (!date) return ''
  let dateFormat = new Date(date)
  let year = dateFormat.getFullYear()
  let month = dateFormat.getMonth() + 1
  if (month < 10) month = '0' + month
  let mydate = dateFormat.getDate()
  if (mydate < 10) mydate = '0' + mydate
  let hours = dateFormat.getHours()
  if (hours < 10) hours = '0' + hours
  let minutes = dateFormat.getMinutes()
  if (minutes < 10) minutes = '0' + minutes
  let seconds = dateFormat.getSeconds()
  if (seconds < 10) seconds = '0' + seconds
  let time = `${year}-${month}-${mydate} ${hours}:${minutes}:${seconds}`
  return time
}
