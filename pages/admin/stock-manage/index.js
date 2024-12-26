Page({
  data: {
    goodsId: '',
    goodsInfo: null,
    stockLogs: [],
    showStockModal: false,
    stockType: 1,
    quantity: '',
    remark: ''
  },

  onLoad(options) {
    this.setData({
      goodsId: options.id
    })
    this.loadGoodsInfo()
    this.loadStockLogs()
  },

  async loadGoodsInfo() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getGoodsDetail',
        data: { goodsId: this.data.goodsId }
      })
      this.setData({
        goodsInfo: res.result.data
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  async loadStockLogs() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getStockLogs',
        data: { goodsId: this.data.goodsId }
      })
      this.setData({
        stockLogs: res.result.data
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  showModal() {
    this.setData({
      showStockModal: true,
      stockType: 1,
      quantity: '',
      remark: ''
    })
  },

  hideModal() {
    this.setData({
      showStockModal: false
    })
  },

  onStockTypeChange(e) {
    this.setData({
      stockType: parseInt(e.detail.value)
    })
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  async submitStock() {
    const { goodsId, stockType, quantity, remark } = this.data
    
    if (!quantity) {
      wx.showToast({
        title: '请输入数量',
        icon: 'none'
      })
      return
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'updateStock',
        data: {
          goodsId,
          type: stockType,
          quantity: parseInt(quantity),
          remark
        }
      })

      if (res.result.code === 0) {
        wx.showToast({ title: '操作成功' })
        this.hideModal()
        this.loadGoodsInfo()
        this.loadStockLogs()
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }
}) 