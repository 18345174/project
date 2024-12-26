Page({
  data: {
    orderId: '',
    orderInfo: null
  },

  onLoad(options) {
    const { id } = options
    this.setData({ orderId: id })
    this.loadOrderDetail()
  },

  async loadOrderDetail() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getOrderDetail',
        data: { orderId: this.data.orderId }
      })
      this.setData({
        orderInfo: res.result.data
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  async cancelOrder() {
    try {
      await wx.cloud.callFunction({
        name: 'cancelOrder',
        data: { orderId: this.data.orderId }
      })
      wx.showToast({ title: '取消成功' })
      this.loadOrderDetail()
    } catch (error) {
      wx.showToast({
        title: '取消失败',
        icon: 'none'
      })
    }
  },

  async confirmReceive() {
    try {
      await wx.cloud.callFunction({
        name: 'confirmOrder',
        data: { orderId: this.data.orderId }
      })
      wx.showToast({ title: '确认收货成功' })
      this.loadOrderDetail()
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  copyOrderNo() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderNo,
      success: () => {
        wx.showToast({ title: '复制成功' })
      }
    })
  }
}) 