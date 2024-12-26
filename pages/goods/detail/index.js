Page({
  data: {
    goodsInfo: null,
    deliveryType: 'self', // self: 自提, delivery: 配送
    quantity: 1
  },

  onLoad(options) {
    const { id } = options
    this.loadGoodsDetail(id)
  },

  async loadGoodsDetail(id) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getGoodsDetail',
        data: { id }
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

  changeDeliveryType(e) {
    this.setData({
      deliveryType: e.currentTarget.dataset.type
    })
  },

  changeQuantity(e) {
    const type = e.currentTarget.dataset.type
    let { quantity } = this.data
    
    if (type === 'minus' && quantity > 1) {
      quantity--
    } else if (type === 'plus') {
      quantity++
    }
    
    this.setData({ quantity })
  },

  async addToCart() {
    const { goodsInfo, quantity, deliveryType } = this.data
    try {
      await wx.cloud.callFunction({
        name: 'addToCart',
        data: {
          goodsId: goodsInfo._id,
          quantity,
          deliveryType
        }
      })
      
      wx.showToast({
        title: '添加成功'
      })
    } catch (error) {
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    }
  }
}) 