export const formOption = {
  span: 24,
  labelWidth: 90,
  menuBtn: false,
  column: [
    {
      label: '图片尺寸',
      prop: 'imageSize',
      type: 'select',
      span: 20,
      dicType: 'showImageSizeList',
      rules: [
        {
          required: true,
          message: '图片尺寸'
        }
      ]
    },
    {
      label: '图片备注',
      span: 20,
      prop: 'remark'
    }
  ]
}