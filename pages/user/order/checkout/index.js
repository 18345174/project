Page({
  data: {
    orderItems: [],
    totalPrice: 0,
    address: null,
    deliveryType: 'self', // self: 自提, delivery: 配送
    remark: ''
  },

  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('checkoutData', (data) => {
      const { items } = data
      this.setData({
        orderItems: items,
        totalPrice: this.calculateTotal(items)
      })
    })
    this.loadDefaultAddress()
  },

  async loadDefaultAddress() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getDefaultAddress'
      })
      if (res.result.data) {
        this.setData({
          address: res.result.data
        })
      }
    } catch (error) {
      console.error('加载地址失败', error)
    }
  },

  calculateTotal(items) {
    return items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0).toFixed(2)
  },

  onDeliveryChange(e) {
    this.setData({
      deliveryType: e.detail.value
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  chooseAddress() {
    wx.navigateTo({
      url: '/pages/user/address/list/index?choose=true'
    })
  },

  async submitOrder() {
    const { orderItems, address, deliveryType, remark, totalPrice } = this.data
    
    if (deliveryType === 'delivery' && !address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'createOrder',
        data: {
          items: orderItems,
          address: deliveryType === 'delivery' ? address : null,
          deliveryType,
          remark,
          totalPrice
        }
      })

      if (res.result.code === 0) {
        // 调用支付
        this.processPay(res.result.data.orderId)
      } else {
        wx.showToast({
          title: '下单失败',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.showToast({
        title: '下单失败',
        icon: 'none'
      })
    }
  },

  async processPay(orderId) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'payment',
        data: { orderId }
      })

      wx.requestPayment({
        ...res.result.payment,
        success: () => {
          wx.showToast({ title: '支付成功' })
          wx.redirectTo({
            url: '/pages/user/order/detail/index?id=' + orderId
          })
        },
        fail: () => {
          wx.showToast({
            title: '支付取消',
            icon: 'none'
          })
          wx.redirectTo({
            url: '/pages/user/order/list/index'
          })
        }
      })
    } catch (error) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    }
  }
}) 