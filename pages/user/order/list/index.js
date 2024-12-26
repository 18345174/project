Page({
  data: {
    tabList: ['全部', '待付款', '待发货', '待收货', '已完成'],
    currentTab: 0,
    orderList: [],
    loading: true
  },

  onLoad() {
    this.loadOrderList()
  },

  onShow() {
    this.loadOrderList()
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTab: index
    })
    this.loadOrderList()
  },

  async loadOrderList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          status: this.data.currentTab // 0: 全部, 1: 待付款, 2: 待发货, 3: 待收货, 4: 已完成
        }
      })
      this.setData({
        orderList: res.result.data,
        loading: false
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/user/order/detail/index?id=${id}`
    })
  },

  async cancelOrder(e) {
    const { id } = e.currentTarget.dataset
    try {
      await wx.cloud.callFunction({
        name: 'cancelOrder',
        data: { orderId: id }
      })
      wx.showToast({ title: '取消成功' })
      this.loadOrderList()
    } catch (error) {
      wx.showToast({
        title: '取消失败',
        icon: 'none'
      })
    }
  },

  async confirmReceive(e) {
    const { id } = e.currentTarget.dataset
    try {
      await wx.cloud.callFunction({
        name: 'confirmOrder',
        data: { orderId: id }
      })
      wx.showToast({ title: '确认收货成功' })
      this.loadOrderList()
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }
}) 