/* eslint-disable */
import { get } from 'lodash'

export function timesFormatter(row, times) {
  return times
    .filter(time => time.show && get(row, time.prop))
    .map(time => (
      `<div><span class="info-item__label">${time.label}</span>：<span class="info-item__content">${get(row, time.prop)}</span></div>`
    ))
    .join('')
}