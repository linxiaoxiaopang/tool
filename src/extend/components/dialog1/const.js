/* eslint-disable no-undef */
export const defaultOptions = {
  is: 'elDialog',
  title: '编辑',
  width: 800,
  customClass: 'extend-dialog',
  appendToBody: true,
  hasFooter: true,
  cancelBtn: true,
  cancelText: '取消',
  confirmBtn: true,
  confirmText: '确定'
}

export const btnDefaultOptions = {
  hasBtn: true,
  size: 'small',
  type: 'primary'
}

export const dialogProps = [
  'is',
  'title',
  'width',
  'fullscreen',
  'top',
  'modal',
  'modalAppendToBody',
  'appendToBody',
  'lockScroll',
  'closeOnClickModal',
  'closeOnPressEscape',
  'showClose',
  'beforeClose',
  'center',
  'destroyOnClose',
  
  // elDrawer
  'size',
  'withHeader',
  'direction',
  'wrapperClosable',
  'withHeader'
]

export const btnProps = [
  'type',
  'size',
  'icon',
  'text',
  'class',
  'danger'
]