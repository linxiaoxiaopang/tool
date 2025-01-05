export default {
  inserted(el, { value = '°' }) {
    const unit = value || '°'
    const inputDom = el.querySelector('input')
    const icon = document.createElement('span')
    const iconChild0 = document.createElement('span')
    const iconChild1 = document.createElement('span')
    const { paddingLeft, paddingRight, fontSize } = window.getComputedStyle(inputDom)
    const calcWidth = inputDom.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
    Object.assign(iconChild0.style, {
      pointerEvents: 'none',
      display: 'inline-block',
      maxWidth: calcWidth + 'px',
      overflow: 'hidden',
      color: 'transparent'
    })
    Object.assign(iconChild1.style, {
      pointerEvents: 'none',
      position: 'relative',
      top: '-10px'
    })
    iconChild0.innerHTML = inputDom.value + ''
    iconChild1.innerHTML = unit + ''
    icon.appendChild(iconChild0)
    icon.appendChild(iconChild1)
    Object.assign(icon.style, {
      pointerEvents: 'none',
      position: 'relative',
      'z-index': 1,
      'font-size': fontSize,
      top: `-${inputDom.offsetHeight}px`,
      left: paddingLeft
    })
    inputDom.parentNode.appendChild(icon)
    el.iconChild0 = iconChild0
    const observer = new MutationObserver(() => {
      iconChild0.innerHTML = inputDom.value + ''
      iconChild1.innerHTML = inputDom.value.length ? unit + '' : ''
    })
    observer.observe(inputDom, { attributes: true, childList: true, subtree: true })
    el.observer = observer
  },

  unbind(el) {
    el.observer && el.observer.disconnect()
    el.observer = null
  }
}




