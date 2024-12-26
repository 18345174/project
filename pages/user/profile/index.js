Page({
  data: {
    userInfo: null,
    orderCounts: {
      unpaid: 0,
      unshipped: 0,
      unreceived: 0,
      completed: 0
    }
  },

  onShow() {
    this.loadUserInfo()
    this.loadOrderCounts()
  },

  loadUserInfo() {
    const userInfo = getApp().globalData.userInfo
    this.setData({ userInfo })
  },

  async loadOrderCounts() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getOrderCounts'
      })
      this.setData({
        orderCounts: res.result.data
      })
    } catch (error) {
      console.error('获取订单统计失败', error)
    }
  },

  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
  },

  handleAddress() {
    wx.navigateTo({
      url: '/pages/user/address/list/index'
    })
  },

  handleOrders(e) {
    const { status } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user/order/list/index?status=${status}`
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          getApp().globalData.userInfo = null
          this.setData({ userInfo: null })
        }
      }
    })
  }
}) 