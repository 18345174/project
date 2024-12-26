Page({
  data: {
    id: '',
    name: '',
    icon: '',
    sort: 0,
    isEdit: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        id: options.id,
        isEdit: true
      })
      this.loadCategoryDetail()
    }
  },

  async loadCategoryDetail() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getCategoryDetail',
        data: { id: this.data.id }
      })
      const { name, icon, sort } = res.result.data
      this.setData({ name, icon, sort })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  async chooseIcon() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed']
      })
      
      wx.showLoading({ title: '上传中' })
      
      const filePath = res.tempFilePaths[0]
      const cloudPath = `category/${Date.now()}.${filePath.match(/\.(\w+)$/)[1]}`
      
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      
      this.setData({
        icon: uploadRes.fileID
      })
      
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      })
    }
  },

  async submitForm() {
    const { id, name, icon, sort, isEdit } = this.data
    
    if (!name) {
      wx.showToast({
        title: '请输入分类名称',
        icon: 'none'
      })
      return
    }

    try {
      const functionName = isEdit ? 'updateCategory' : 'addCategory'
      const data = { name, icon, sort: Number(sort) }
      if (isEdit) data.id = id

      await wx.cloud.callFunction({
        name: functionName,
        data
      })

      wx.showToast({
        title: isEdit ? '更新成功' : '添加成功'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.showToast({
        title: isEdit ? '更新失败' : '添加失败',
        icon: 'none'
      })
    }
  }
}) 