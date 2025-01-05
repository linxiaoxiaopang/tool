//上传图片table列表
export const uploadTableDialogCols = [
  {
    prop: 'thumbnail_path',
    label: '图片',
    minWidth: '100',
    align: 'center',
    slotName: 'pathSlot'
  },
  {
    prop: 'title',
    label: '标题',
    minWidth: '200',
    align: 'center'
  },
  {
    prop: 'exist',
    label: '图片状态',
    minWidth: '200',
    align: 'center',
    slotName: 'existSlot'
  },
  {
    prop: 'category_name',
    label: '图片分类1',
    minWidth: '150',
    align: 'center',
    headerSlotName: 'category_nameHeaderSlot',
    slotName: 'category_nameSlot'
  }
]
export const imgListComponentCols = [
  {
    prop: 'title',
    label: '图片名称',
    minWidth: '200',
    align: 'center',
    slotName: 'title'
  },
  {
    prop: 'tags',
    label: '图片标签',
    minWidth: '200',
    align: 'center',
    slotName: 'tagSlot'
  },
  {
    prop: 'imageFolderId',
    label: '所属文件夹',
    minWidth: '200',
    align: 'center',
    headerSlotName: 'imageFolderIdHeaderSlot',
    slotName: 'imageFolderIdSlot'
  }
]

export const option = {
  topPage: false,
  isOnePage: false,
  menu: true,
  menuWidth: 100,
  menuAlign: 'left',
  pageSizes: [5, 10, 20, 50, 200],
  column: [
    {
      label: '图片',
      prop: 'image',
      slot: true
    },
    {
      label: '图片标签',
      prop: 'tag',
      slot: true
    },
    {
      label: '所属文件夹',
      prop: 'imageFolderId'
    }
  ]
}
