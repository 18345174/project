Page({
  data: {
    id: '',
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    isEdit: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        id: options.id,
        isEdit: true
      })
      this.loadGoodsDetail()
    }
  },

  async loadGoodsDetail() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getGoodsDetail',
        data: { goodsId: this.data.id }
      })
      const { name, price, stock, description, image } = res.result.data
      this.setData({
        name,
        price,
        stock,
        description,
        image
      })
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

  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      
      wx.showLoading({ title: '上传中' })
      
      const filePath = res.tempFilePaths[0]
      const cloudPath = `goods/${Date.now()}-${Math.random().toString(36).slice(-6)}.${filePath.match(/\.(\w+)$/)[1]}`
      
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      
      this.setData({
        image: uploadRes.fileID
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
    const { id, name, price, stock, description, image, isEdit } = this.data
    
    if (!name || !price || !stock || !description || !image) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    try {
      const functionName = isEdit ? 'updateGoods' : 'addGoods'
      const data = {
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        image
      }
      
      if (isEdit) {
        data.goodsId = id
      }

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